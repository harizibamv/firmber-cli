import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { LLMClient } from "./types/core.js";
import { LangChainProviderConfig } from "./types/config.js";
import { ChatOpenAI } from "@langchain/openai";
import { logError } from "./utils/message-queue.js";




export class LangChainClient implements LLMClient{
	private chatModel: BaseChatModel;
	private currentModel: string;
	private availableModels: string[];
	private providerConfig: LangChainProviderConfig;
	private modelInfoCache: Map<string, any> = new Map();
	private toolCallHistory: Array<{
		toolName: string;
		args: any;
		timestamp: number;
	}> =  [];

	constructor(providerConfig: LangChainProviderConfig){
		this.providerConfig = providerConfig;
		this.availableModels = providerConfig.models;
		this.currentModel = providerConfig.models[0] || '';
		this.chatModel = this.createChatModel();
	}

	static async create(providerConfig:LangChainProviderConfig): Promise<LangChainClient>{
		const client = new LangChainClient(providerConfig);

		// Fetch OpenRouter model info if this is OpenRouter
		if (providerConfig.name === 'openrouter') {
			await client.fetchOpenRouterModelInfo();
		}

		return client;
	}


	private createChatModel() : BaseChatModel{
		const {config} = this.providerConfig;
		return new ChatOpenAI({
			modelName: this.currentModel,
			openAIApiKey: config.apiKey || 'dummy-key',
			configuration: {
				baseURL: config.baseURL,
			},
			...config,
		});
	}


	private async fetchOpenRouterModelInfo(): Promise<void> {
		if (
			this.providerConfig.name !== 'openrouter' ||
			!this.providerConfig.config.apiKey
		) {
			return;
		}

		try {

			const response = await fetch('https://openrouter.ai/api/v1/models', {
				headers: {
					Authorization: `Bearer ${this.providerConfig.config.apiKey}`,
					'Content-Type' : 'application/json'
				}
			});

			if (response.ok) {
				const data: any = await response.json();
				for (const model of data.data) {
					this.modelInfoCache.set(model.id, model);
				}
			}

		} catch(error) {
			logError(`Failed to fetch OpenRouter model info: ${error}`);
		}

	}


}



