import React from "react";
import ErrorMessage from "../components/error-message.js";
import { MessageType } from "../types/utils.js";
import SucessMessage from "../components/success-message.js";
import InfoMessage from "../components/info-message.js";

let globalAddToChatQueue: ((component: React.ReactNode) => void) | null = null;
let componentKeyCounter = 0;


function getNextKey(): string{
	componentKeyCounter++;
	return `global-msg-${componentKeyCounter}`;
}

export function addMessageToQueue(type: MessageType, message: string, hideBox: boolean = true){
	if(!globalAddToChatQueue){
		console[type == 'error' ? 'error' : 'log'] (message);
		return;
	}
	const key = getNextKey();
	let component: React.ReactNode;

	switch(type){
		case 'error':
			component = (
				<ErrorMessage
					key = {key}
					message = {message}
					hideBox ={hideBox}
				/>
			);
			break;
		case 'success':
			component = (
				<SucessMessage
					key={key}
					message={message}
					hideBox={hideBox}
				/>
			);
			break;
		case 'info':
		default:
			component = (
				<InfoMessage
					key={key}
					message={message}
					hideBox={hideBox}
				/>
			);
			break;
	}
	globalAddToChatQueue(component);
}


export function logInfo(message:string, hideBox:boolean = true){
	addMessageToQueue('info', message, hideBox);
}

export function logError(message: string, hideBox: boolean = true){
	addMessageToQueue('error', message, hideBox);
}
