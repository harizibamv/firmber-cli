import { loadPreferences } from "../../config/preferences.js";



export function useAppState(){

	// Initialize theme from preferences
	const preferences = loadPreferences();
	const initialTheme = preferences.selectedTheme || defaultTheme;
}
