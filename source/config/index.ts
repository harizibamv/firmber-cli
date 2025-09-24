import { join } from "path";
import { AppConfig } from "../types/config.js";
import { existsSync, readFileSync } from "fs";
import { logError } from "../utils/message-queue.js";





function loadAppConfig(): AppConfig {
	const agentsJsonPath = join(process.cwd(), 'agents.config.json');

	if(existsSync(agentsJsonPath)){
		try{

			const agentsData = JSON.parse(readFileSync(agentsJsonPath, 'utf-8'));

			if(agentsData.firmber){
					return {
						providers: agentsData.firmber.providers,
						mcpServers: agentsData.firmber.mcpServers,
					};
			}
		}catch(error){
			logError(`Failed to parse agents.config.json: ${error}`);
		}
	}

	return {};
}

export const appConfig = loadAppConfig();
