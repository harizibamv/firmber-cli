import { ProviderType } from "./core.js";
import { ThemePreset } from "./ui.js";

export interface UserPreferences {
	lastProvider?: ProviderType;
	lastModel?:string;
	providerModels?:{
		[key in ProviderType]?: string;
	};
	lastUpdateCheck?:number;
	selectedTheme?: ThemePreset;
}

export type LogLevel = "silent" | "normal" | "verbose";

export interface AppConfig {
	providers?: {
		name: string;
		baseUrl?:string;
		apiKey?: string;
		models: string[];
		[key: string]: any;
	}[];

	mcpServers?:{
		name: string;
		command: string;
		args?: string[];
		env?: Record<string, string>;
	}[]
}

export interface LangChainProviderConfig{
	name: string,
  	type: "openai" | "anthropic" | "openai-compatible" | string,
	models: string[];
	config: Record<string, any>;
}
