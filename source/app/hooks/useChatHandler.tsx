import React from "react";
import ToolMessage from "../../components/tool-message.js";
import { ToolManager } from "../../tools/tool-manager.js";
import { LLMClient, Message } from "../../types/core.js";
import { ThinkingStats } from "./useAppState.js";


interface UseChatHandlerProps{
	client: LLMClient | null;
	toolManager: ToolManager | null;
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	getMessageTokens?:(message:Message) => number;
	currentModel: string;
	setIsThinking: (thinking: boolean) => void;
	setIsCancelling: (cancelling: boolean) => void;
	setThinkingStats: (stats: ThinkingStats | ((prev:ThinkingStats) => ThinkingStats)) => void;
	addToChatQueue: (component: React.ReactNode) => void;
	componentKeyCounter: number;
	abortController: AbortController | null;
	setAbortController: (controller: AbortController | null) => void;
	onStartToolConfirmationFlow: (
		toolCalls: any[],
		updatedMessage: Message[],
		assistantMsg: Message,
		systemMessage: Message,
	) => void;
}

export function useChatHandler({
	client,
	toolManager,
	messages,
	setMessages,
	getMessageTokens,
	currentModel,
	setIsThinking,
	setIsCancelling,
	setThinkingStats,
	addToChatQueue,
	componentKeyCounter,
	abortController,
	setAbortController,
	onStartToolConfirmationFlow,
}: UseChatHandlerProps)  {
	// Display tool result with proper formatting (similar to useToolHandler)
	const displayToolResult = async (toolCall: any, result: any) => {
		if(toolManager) {
			const formatter = toolManager.getToolFormatter(result.name);
			if(formatter){
				try{

					let parsedArgs = toolCall.function.arguments;
					if (typeof parsedArgs === 'string') {
						try{
							parsedArgs = JSON.parse(parsedArgs);
						}catch(e){
							// If parsing fails, use as-is
						}
					}
					const formattedResult = await formatter(parsedArgs, result.content);

					if(React.isValidElement(formattedResult)){
						addToChatQueue(
							React.cloneElement(formattedResult, {
								key: `tool-result-${result.tool_call_id}-${componentKeyCounter}-${Date.now()}`,
							}),
						);
					}else{
						addToChatQueue(
							<ToolMessage
								key={`tool-result-${result.tool_call_id}-${componentKeyCounter}`}
								title={`⚒ ${result.name}`}
								message={result.content}
								hideBox={true}
							/>,
						);
					}

				}catch(formatterError){
					//If formatter fails, show raw result
					addToChatQueue(
						<ToolMessage
							key={`tool-result-${result.tool_call_id}-${componentKeyCounter}`}
							title={`⚒ ${result.name}`}
							message={result.content}
							hideBox={true}
						/>,
					);
				}
			}else {
				// No formatter, show raw result
				addToChatQueue(
					<ToolMessage
						key={`tool-result-${result.tool_call_id}-${componentKeyCounter}`}
						title={`⚒ ${result.name}`}
						message={result.content}
						hideBox={true}
					/>,
				);
			}
		}
	};

	// Throttle thinking stats updates to reduce re-renders
	const throttledSetThinkingStats =React.useCallback(
		(() => {
			let lastUpdate = 0;
			const throttleMs = 250; // Update at most 4 times per second
			return (
				stats: ThinkingStats | ( (prev: ThinkingStats) => ThinkingStats),
			) => {
				const now = Date.now();
				if (now - lastUpdate >= throttleMs) {
					lastUpdate = now;
					setThinkingStats(stats);
				}
			}
	}) () , [setThinkingStats]);

	// Helper to make async iterator cancellable with frequent abort checking
	const makeCancellableStream = async function* (
		stream: AsyncIterable<any>,
		abortSignal?:AbortSignal
	) : AsyncIterable<any> {
		const iterator = stream[Symbol.asyncIterator]();
		try {
			while(true){
				if(abortSignal?.aborted){
					throw new Error('Operation was cancelled');
				}

				// Use Promise.race to make iterator.next() cancellable with frequent checking
				const nextPromise = iterator.next();
				

			}
		} finally {
			if (iterator.return) {
				await iterator.return();
			}
		}
	}


}
