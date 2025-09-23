import { Tool, ToolDefinition, ToolHandler } from "../types/core.js";
import { createFileTool } from "./create-file.js";
import { editFileTool } from "./edit-file.js";
import { executeBashTool } from "./execute-bash.js";
import { readFileTool } from "./read-file.js";
import { readManyFilesTool } from "./read-many-files.js";



export const toolDefinitions: ToolDefinition[] = [
	readFileTool,
	createFileTool,
	editFileTool, // balance
	readManyFilesTool,
	executeBashTool
]

export const toolRegistry: Record<string, ToolHandler> = Object.fromEntries(
	toolDefinitions.map();
);
