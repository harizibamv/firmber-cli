import React from 'react';
import { Text } from 'ink';
import { Select } from "@inkjs/ui";
import { useAppState } from './app/hooks/useAppState.js';

type Props = {
	name: string | undefined;
};

export default function App() {

	// Use extracted hooks
	const appState = useAppState();

	// Create 

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
