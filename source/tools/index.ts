import React from "react";
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
	toolDefinitions.map(def => [def.config.function.name, def.handler]),
);

export const tools : Tool[] = toolDefinitions.map(def => def.config);


export const toolFormatters: Record<
		string, (
			args:any
		) =>
			| string
			| Promise<string>
			| React.ReactElement
			| Promise<React.ReactElement>
		> = Object.fromEntries(
			toolDefinitions
				.filter(def => def.formatter).map(def => [def.config.function.name, def.formatter!]),
);
