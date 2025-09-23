import { readFileSync } from "fs";
import { CustomCommandMetadata, ParsedCustomCommand } from "../types/commands.js";
import { logError } from "../utils/message-queue.js";

/**
 * Enhanced YAML frontmatter parser with support for multi-line strings and nested objects
 */
function parseEnhancedFrontmatter(frontmatter:string):CustomCommandMetadata{
	const metadata: CustomCommandMetadata = {};
	const lines = frontmatter.split('\n');
	let currentKey: string | null = null;
	let currentValue: string[] = [];
	let isMultiline = false;
	let indentLevel = 0;

	const processKeyValue = (key:string, value: string) => {
		const trimmedValue = value.trim();

		if(key == 'description'){
			metadata.description = trimmedValue.replace(/^["']|["']$/g, '');
		}else if(key === 'aliases'){
			if(trimmedValue.startsWith('[') && trimmedValue.endsWith(']')){
				const content = trimmedValue.slice(1, -1);
				metadata.aliases = content.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(s => s.length > 0);
			}else{
				metadata.aliases  = [trimmedValue.replace(/^["']|["']$/g, '')];
			}
		}else if(key === 'parameters'){
		if(trimmedValue.startsWith('[') && trimmedValue.endsWith(']')){
				const content = trimmedValue.slice(1, -1);
				metadata.parameters = content.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(s => s.length > 0);
			}else{
				metadata.parameters  = [trimmedValue.replace(/^["']|["']$/g, '')];
			}
		}
	};

	for (let i = 0;i<lines.length;i++){
		const line = lines[i];
		if(!line) continue;

		const trimmedLine = line.trim();

		if(!trimmedLine || trimmedLine.startsWith('#')){
			continue;
		}

		// Check for YAML dash
		if(trimmedLine.startsWith('- ') && currentKey){
			const arrayItem = trimmedLine.slice(2).trim().replace(/^["']|["']$/g, '');
			if(currentKey === 'aliases'){
				if (!metadata.aliases){
					metadata.aliases = [];
				}
				metadata.aliases.push(arrayItem);
			}else if(currentKey === 'parameters'){
				if(!metadata.parameters){
					metadata.parameters =[];
				}
				metadata.parameters?.push(arrayItem);
			}
			continue;
		}

		if(trimmedLine.endsWith('|') || trimmedLine.endsWith('>')){
			const colonIndex = line.indexOf(':');
			if(colonIndex !== -1){
				currentKey = line.slice(0, colonIndex).trim();
				isMultiline = true;
				currentValue = [];
				indentLevel = 0;
				continue;
			}
		}

		if (isMultiline && currentKey) {
			const lineIndent = line.length - line.trimStart().length;

			if(trimmedLine && indentLevel === 0){
				indentLevel = lineIndent;
			}

			

		}

	}
}


/**
 * Parse a markdown file with optional YAML frontmatter
 */
export function parseCommandFile(filePath: string):ParsedCustomCommand {

	const fileContent = readFileSync(filePath,  'utf-8');

	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const match = fileContent.match(frontmatterRegex);

	if(match && match[1] && match[2]){
		const frontmatter = match[1];
		const content = match[2];
		let metadata: CustomCommandMetadata = {};

		try{
			metadata = parseEnhancedFrontmatter(frontmatter);
		}catch(error){
			logError(`Failed to parse frontmatter in $`);
		}

	}

}
