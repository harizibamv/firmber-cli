import { Tool, ToolDefinition } from "../types/core.js";
import { createFileTool } from "./create-file.js";
import { readFileTool } from "./read-file.js";



export const toolDefinitions: ToolDefinition[] =[
	readFileTool,
	createFileTool,

]

export const tools: Tool[] = toolDefinitions.map();
