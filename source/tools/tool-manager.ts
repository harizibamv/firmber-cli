import React from "react";
import { MCPClient } from "../mcp/mcp-client.js";
import { MCPToolAdapter } from "../mcp/mcp-tool-adapter.js";
import { Tool, ToolHandler } from "../types/core.js";
import {
	tools as staticTools,
	toolRegistry as staticToolRegistry,
	toolFormatters as staticToolFormatters,
} from './index.js';
import { MCPInitResult } from "../types/mcp.js";


export class  ToolManager{
	private mcpClient:MCPClient | null = null;
	private mcpAdapter: MCPToolAdapter | null = null;
	private toolRegistry: Record<string, ToolHandler> = {};
	private toolFormatters: Record<string, (args: any) => string | Promise<string> | React.ReactElement | Promise<React.ReactElement>> = {};
	private allTools: Tool[] = [];

	constructor () {
		// Initialize with static tools
		this.toolRegistry = {...staticToolRegistry};
		this.toolFormatters = {...staticToolFormatters};
		this.allTools = [...staticTools]
	}

	async initializeMCP(
		servers: any[],
		onProgress?: (result:MCPInitResult) => void
	):Promise<MCPInitResult[]> {
		if(servers && servers.length > 0){
			this.mcpClient = new MCPClient();
			this.mcpAdapter = new MCPToolAdapter(this.mcpClient);

			const results = await this.mcpClient.connectToServers(servers,onProgress);

			this.mcpAdapter.registerMCPTools(this.toolRegistry);

			const mcpTools = this.mcpClient.getAllTools();
			this.allTools = [...staticTools, ...mcpTools];
		}
		return [];
	}

	/**
	 * Get all the available tools (static + mcp)
	 */

	getAllTools(): Tool[] {
		return this.allTools;
	}


	/**
	 * Get the tool registry
	 */
	getToolRegistry(): Record<string, ToolHandler> {
		return this.toolRegistry;
	}


	/**
	 * Get a Specific tool handler
	 */
	getToolHandler(toolName:string): ToolHandler | undefined {
		return this.toolRegistry[toolName];
	}

	/**
	 * Get a specific tool formatter
	 */
	getToolFormatter(toolName:string): ((args:any, result?:string) => string| Promise<string> | React.ReactElement | Promise<React.ReactElement>) | undefined{
		return this.toolFormatters[toolName];
	}

	/**
	 * Check if a tool exists
	 */
	hasTool(toolName: string) :boolean{
		return toolName in this.toolRegistry;
	}

	/**
	 * Disconnect MCP servers
	 */
	async disconnectMCP():Promise<void> {
		if(this.mcpClient && this.mcpAdapter){
			this.mcpAdapter.unregisterMCPTools(this.toolRegistry);

			await this.mcpClient.disconnect();
			this.allTools = [...staticTools];
			this.mcpClient = null;
			this.mcpAdapter = null;
		}
	}

	/**
	 * Get connected MCP servers
	 */
	getConnectedServers(): string[] {
		return this.mcpClient?.getConnectedServers() || [];
	}

	/**
	 * Get tools for a specific MCP server
	 */
	getServerTools(serverName: string):any[]{
		return this.mcpClient?.getServerTools(serverName) || [];
	}

}
