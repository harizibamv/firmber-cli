import { Tool } from "../types/core.js";



export const toolDefinitions: ToolDefinition[] =[
	readFileTool,
	createFileTool,
	
]

export const tools: Tool[] = toolDefinitions.map();
