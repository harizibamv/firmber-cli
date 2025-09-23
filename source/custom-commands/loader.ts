import { existsSync, readdirSync, statSync } from "fs";
import { CustomCommand } from "../types/commands.js";
import { join } from "path";



export class CustomCommandLoader {
	private commands: Map<string,CustomCommand> = new Map();
	private aliases: Map<string, string> = new Map();
	private projectRoot: string;
	private commandsDir: string;

	constructor (projectRoot: string = process.cmd()) {
		this.projectRoot = projectRoot;
		this.commandsDir = join(projectRoot, ".firmber", "commands");
	}

	async loadCommands():Promise<void>{
		this.commands.clear();
		this.aliases.clear();

		if(!existsSync(this.commandsDir)){
			return;
		}

		this.scanDirectory();
	}


	/** Load a Single command file
	 */
	private loadCommand(filePath: string, namespace?:string): void{
		try{
			const parsed
		}catch(){

		}
	}


	private scanDirectory(dir:string, namespace?:string):void{
		const entries = readdirSync(dir);
		for(const entry of entries){
			const fullPath = join(dir, entry);
			const stat = statSync(fullPath); // get information of the file like permission file type...
			if(stat.isDirectory()){
				// Subdirectory becomes a namespace
				const subNamespace = namespace ? `${namespace}:${entry}`: entry;
				this.scanDirectory(fullPath, subNamespace);
			}else if(entry.endsWith(".md")){
				this.loadCommand(fullPath , namespace);
			}

		}
	}

}

