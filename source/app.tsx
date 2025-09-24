import React from 'react';
import { Text } from 'ink';
import { Select } from "@inkjs/ui";
import { useAppState } from './app/hooks/useAppState.js';
import { getThemeColors } from './config/themes.js';
import { setGlobalMessageQueue } from './utils/message-queue.js';

type Props = {
	name: string | undefined;
};

export default function App() {

	// Use extracted hooks
	const appState = useAppState();

	// Create theme context value
	const themeContextValue = {
		currentTheme: appState.currentTheme,
		colors:getThemeColors(appState.currentTheme),
		setCurrentTheme: appState.setCurrentTheme,
	}

	// Initialize global message queue on Component mount
	React.useEffect(()=> {
		setGlobalMessageQueue(appState.addToChatQueue);
	}, []);

	// Setup chat handler
	const chatHandler = useChatHandler({
		
	})

  return (
    <>
      <Text>Hello, {name}!</Text>
      <Text>Choose an option:</Text>
      <Select
        options={[
        {label: 'Help', value: 'help'},
        {label: 'Create Task', value: 'create-task'},
        {label: 'Delete Task', value: 'delete-task'},
        {label: 'Complete Task', value: 'complete-task'},
        {label: 'View tasks', value: 'view-task'},
        {label: 'Exit', value: 'exit'},
       ]}
      onChange={(value: string) => {
        console.log(`Selected: ${value}`);
      }}
    />
    </>
  )
}
