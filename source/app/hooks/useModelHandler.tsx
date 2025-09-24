import React from "react";
import ErrorMessage from "../../components/error-message.js";
import SucessMessage from "../../components/success-message.js";
import { loadPreferences, savePreferences, updateLastUsed } from "../../config/preferences.js";
import { LLMClient, Message, ProviderType } from "../../types/core.js";
import { ThemePreset } from "../../types/ui.js";
import { createLLMClient } from "../../client-factory.js";
import SuccessMessage from "../../components/success-message.js";


interface UseModeHandlersProps {
	client: LLMClient | null;
	currentModel: string;
	currentProvider: ProviderType;
	setClient: (client:LLMClient | null) => void;
	setCurrentModel: (model: string) => void;
	setCurrentProvider: (provider: ProviderType) => void;
	setCurrentTheme: (theme: ThemePreset) => void;
	setMessages: (messages: Message[]) => void;
	setIsModelSelectionMode: (mode:boolean) => void;
	setIsProviderSelectionMode: (mode:boolean) => void;
	setIsThemeSelectionMode: (mode: boolean) => void;
	addToChatQueue: (component: React.ReactNode) => void;
	componentKeyCounter: number;
}

export function useModelHandlers({
	client,
	currentModel,
	currentProvider,
	setClient,
	setCurrentModel,
	setCurrentProvider,
	setCurrentTheme,
	setMessages,
	setIsModelSelectionMode,
	setIsProviderSelectionMode,
	setIsThemeSelectionMode,
	addToChatQueue,
	componentKeyCounter,
} :  UseModeHandlersProps ) {

	// Helper function to enter model selection mode
	const enterModelSelectionModel = () => {
		setIsModelSelectionMode(true);
	}

	// Helper function to enter provider selection mode
	const enterProviderSelectionMode = () => {
		setIsProviderSelectionMode(true);
	}

	// Handle model selection
	const handleModelSelect = async (selectedModel: string) => {
		if (client && selectedModel !== currentModel){
			client.setModel(selectedModel);
			setCurrentModel(selectedModel);

			// Update preferences
			updateLastUsed(currentProvider, selectedModel);

			addToChatQueue(<SucessMessage
					key={`model-changed-${componentKeyCounter}`}
					message={`Model changed to : ${selectedModel}`}
					hideBox={true}
				/>);

		}
		setIsModelSelectionMode(true);
	}

	// Handle model selection cancel
	const handleModelSelectionCancel = () => {
		setIsModelSelectionMode(false);
	}

	const handleProviderSelect = async (selectedProvider: ProviderType) => {
		if (selectedProvider !== currentProvider) {
			try {
				// Create new client for the selected provider
				const {client: newClient, actualProvider} = await createLLMClient(
					selectedProvider,
				);

				if (actualProvider !== selectedProvider) {
					addToChatQueue(
						<ErrorMessage
							key={`provider-forced-${componentKeyCounter}`}
							message={`${selectedProvider} is not available. Please ensure it's properly configured in agents.config.json`}
							hideBox={true}
						/>
					);
					return ;
				}

				setClient(newClient);
				setCurrentProvider(actualProvider);

				const newModel = newClient.getCurrentModel();
				setCurrentModel(newModel);

				setMessages([]);

				await newClient.clearContext();

				updateLastUsed(actualProvider, newModel);

				addToChatQueue(<SuccessMessage
					key={`provider-changed-${componentKeyCounter}`}
					message={`Provider changed to: ${actualProvider}, model: ${newModel}. Chat history cleared.`}
					hideBox={true}
				/>);

			}catch(error){
				// Add error message if provider change fails
				addToChatQueue(
					<ErrorMessage
						key = {`provider-error-${componentKeyCounter}`}
						message={`Failed to change provider to ${selectedProvider}: ${error}`}
						hideBox={true}
					/>
				);
			}
		}
		setIsProviderSelectionMode(false);
	}

	//Handler provider selection cancel
	const handleProviderSelectionCancel = () => {
		setIsProviderSelectionMode(false);
	};

	//Helper function to enter theme selection mode
	const enterThemeSelectionMode = () => {
		setIsThemeSelectionMode(true);
	}

	// Handle theme selection
	const handleThemeSelect = (selectedTheme: ThemePreset) => {
		const preferences = loadPreferences();
		preferences.selectedTheme = selectedTheme;
		savePreferences(preferences);


		setCurrentTheme(selectedTheme);

		addToChatQueue(
			<SuccessMessage
				key={`theme-changed-${componentKeyCounter}`}
				message={`Theme changed to: ${selectedTheme}.`}
				hideBox={true}
			/>,
		);
		setIsThemeSelectionMode(false);
	}

	// Handle theme selection cancel
	const handleThemeSelectionCancel = () => {
		setIsThemeSelectionMode(false);
	}

	return {
		enterModelSelectionModel,
		enterProviderSelectionMode,
		enterThemeSelectionMode,
		handleModelSelect,
		handleModelSelectionCancel,
		handleProviderSelect,
		handleProviderSelectionCancel,
		handleThemeSelect,
		handleThemeSelectionCancel,
	}

}
