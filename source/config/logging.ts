import type { LogLevel } from "../types/config.js";
export type {LogLevel};


 let currentLogLevel:LogLevel = 'normal';



export function shouldLog(level: 'info' | 'warn' | 'error' | 'debug'): boolean{
	if (currentLogLevel === 'silent'){
		return level === 'error';
	}

	if (currentLogLevel === 'normal') {
		return level === 'error' || level ==='warn';
	}

	return true;
}
