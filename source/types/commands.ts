
export interface CustomCommandMetadata{
	description?: string;
	aliases?:string[];
	parameters?:string[];
}

export interface CustomCommand{
	name: string;
	path: string;
	namespace?:string;
	fullName: string;
	metadata: CustomCommandMetadata;
	content: string;
}


export interface ParsedCustomCommand{
	metadata: CustomCommandMetadata;
	content: string;
}
