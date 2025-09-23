import { ToolDefinition, ToolHandler } from "../types/core.js";
import { EditArgs } from "../types/tools.js";
import { executeEdit } from "./edit-file/handlers.js";


const handler:ToolHandler = async (args:EditArgs) : Promise<string> => {
	if (args.mode !== 'find_replace'){
		if(args.line_number === undefined || args.line_number === null){
			throw new Error(`line_number is required for mode "${args.mode}"`);
		}

		const lineNumber = Number(args.line_number);
		if(isNaN(lineNumber) || lineNumber < 1){
			throw new Error(`Invalid line_number: ${args.line_number}. Must be a positive integer.`);
		}

		if(args.end_line !== undefined && args.end_line !== null){
			const endLine = Number(args.end_line);
			if (isNaN(endLine) || endLine < 1) {
				throw new Error(`Invalid end_line: ${args.end_line}. Must be a positive integer.`);
			}
		}

		if (args.mode === 'move'){
			if(args.target_line === undefined || args.target_line === null){
				throw new Error(`target_line is required for move mode.`);
			}
			const targetLine = Number(args.target_line);
			if(isNaN(targetLine) || targetLine < 1){
				throw new Error(`invalid target_line: ${args.target_line}.  Must be a positive integer.`);
			}
		}
	}
	return await executeEdit(args);
}

const formatter = async(args:any,result?: string ): Promise<React.ReactElement> {
	return await formatEditPreview(args, result);
}

export const editFileTool: ToolDefinition = {
	handler,
	formatter,
}
