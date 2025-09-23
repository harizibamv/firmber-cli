import { resolve } from "path";
import { EditArgs } from "../../types/tools.js";
import { readFile, write, writeFile } from "fs";
import { calculateActualEditRange, generatePostEditContext } from "./context.js";
import { validateEditArgs } from "./validation.js";

export async function handleFindReplace(args:EditArgs) : Promise<string>{
	const absPath = resolve(args.path);
	const fileContent = await readFile(absPath, 'utf-8');
	const oldText = args.old_text || '';
	const newText = args.new_text || '';

	if(!fileContent.includes(oldText)){
		throw new Error(`Text "${oldText} not found in file"`);
	}

	const newContent = args.replace_all? fileContent.replaceAll(oldText, newText):fileContent.replace(oldText, newText);

	if(newContent === fileContent){
		return 'No changes made - text already matches';
	}

	await writeFile(absPath, newContent, 'utf-8');

	const updatedLines = newContent.split('\n');

	const replacementText = args.new_text || '';

	let firstChangeLine = 1;
	let lastChangeLine = 1;

	if (replacementText){
		for (let i = 0;i<updatedLines.length;i++) {
			if(updatedLines[i]?.includes(replacementText)){
				if(firstChangeLine === 1) {
					firstChangeLine = i + 1;
				}
				lastChangeLine = i + 1;
			}
		}
	}

	const context = generatePostEditContext(updatedLines, firstChangeLine, lastChangeLine, args.mode);
	return `File edited successfully ${context}`;
}


export async function handleLineBaseEdit(args: EditArgs) : Promise<string>{
	const absPath = resolve(args.path);
	const fileContent = await readFile(absPath, 'utf-8');
	const lines = fileContent.split('\n');

	const validation = validateEditArgs(args, lines);

	if(!validation.isValid){
		throw new Error(validation.error);
	}

	const lineNum = args.line_number!;
	const endLine = args.end_line ?? lineNum;
	const content = args.content || '';

	let newLines = [...lines];
	let description = '';

	switch(args.mode){
		case 'insert': {
			const insertLines = content.split('\n');
			newLines.splice(lineNum - 1, 0, ...insertLines);
			description = `Inserted ${insertLines.length} line${insertLines.length > 1 ? 's':''} at line ${lineNum}`;
			break;
		}
		case 'replace': {
			const replaceLines = content.split('\n');
			const linesToRemove = endLine - lineNum + 1;
			newLines.splice(lineNum -1, linesToRemove, ...replaceLines);
			const rangeDesc = lineNum === endLine ? `line ${lineNum}` : `lines ${lineNum}-${endLine}`;
			description = `Replaced ${rangeDesc} with ${replaceLines.length} lines${replaceLines.length > 1 ? 's' : ''}`;
			break;
		}
		case 'delete':{
			const linesToRemove = endLine - lineNum + 1;
			newLines.splice(lineNum - 1, linesToRemove);
			const rangeDesc = lineNum === endLine ? `line ${lineNum}` : `lines ${lineNum}-${endLine}`;
			description = `Deleted ${rangeDesc}`;
			break;
		}
		case 'move': {
			const targetLine = args.target_line;
			if(!targetLine || targetLine < 1 || targetLine > lines.length + 1){
				throw new Error(`Target line ${targetLine} is invalid`);
			}


			const linesToMove = newLines.splice(lineNum - 1, endLine - lineNum+1);

			const adjustedTarget = targetLine > lineNum ? targetLine - linesToMove.length : targetLine;
			newLines.splice(adjustedTarget-1, 0, ...linesToMove);

			const rangeDesc = lineNum === endLine ? `line ${lineNum}` : `lines ${lineNum}-${endLine}`;
			description = `Moved ${rangeDesc} to line ${targetLine}`;
			break;
		}
	}

	const newContent = newLines.join('\n');
	await writeFile(absPath, newContent, 'utf-8');

	const updatedLines = newContent.split('\n');

	const {startLine: actualStartLine, endLine: actualEndline} = calculateActualEditRange(args.mode, lineNum,args.end_line, content, args.target_line);
	const context = generatePostEditContext(
		updatedLines,
		actualStartLine,
		actualEndline,
		args.mode
	);

	return `Successfully ${description}.${context}`;
}

export async function executeEdit(args: EditArgs): Promise<string> {
	try{
		if(args.mode === 'find_replace'){
			return await handleFindReplace(args);
		}else{
			return await handleLineBaseEdit(args);
		}
	}catch(error){
		throw error;
	}
}
