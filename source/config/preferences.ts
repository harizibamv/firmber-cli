import { existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { shouldLog } from "./logging.js";
import { logError } from "../utils/message-queue.js";
import { ProviderType } from "../types/core.js";
import { UserPreferences } from "../types/config.js";
import { join } from "path";



const PREFERENCES_PATH = join(homedir(),".firmber-preferences.json");

export function loadPreferences	() : UserPreferences{
	if (existsSync(PREFERENCES_PATH)) {
		try{
			const data = readFileSync(PREFERENCES_PATH, "utf-8");
			return JSON.parse(data);
		}catch(error){
			if(shouldLog("warn")){
				logError(`Failed to load preferences: ${error}`);
			}
		}
	}

	return {}
}


export function savePreferences (preferences:UserPreferences):void {
	try{
		writeFileSync(PREFERENCES_PATH, JSON.stringify(preferences, null, 2));
	}catch(error){
		if(shouldLog("warn")){
			logError(`Failed to save preferences: ${error}`);
		}
	}
}

export function updateLastUsed(provider: ProviderType, model:string) : void {
	const preferences = loadPreferences();
	preferences.lastProvider = provider;
	preferences.lastModel = model;

	// Also save the model for this specific provider
	if (!preferences.providerModels){
		preferences.providerModels = {};
	}

	preferences.providerModels[provider] = model;

	savePreferences(preferences);
}
