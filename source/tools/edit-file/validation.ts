import type { EditArgs, ValidationResult } from "../../types/tools.js";



export function validateEditArgs(args: EditArgs, lines:string[]) : ValidationResult{
	const {mode, line_number:lineNum, end_line:endLine, target_line:targetLine, old_text} = args;


	if(mode === 'find_replace'){
		if(!old_text){
			return {
				isValid : false,
				error: 'old_text is required for find_replace mode',
			};
		}
		return {isValid: true};
	}

	if(!lineNum){
		return {
			isValid:false,
			error: 'line_number is required for find_place mode',
		}
	}

	const actualEndline = endLine ?? lineNum;

	if(mode === 'insert'){
		if(lineNum < 1 || lineNum > lines.length + 1){
			return {
				isValid: false,
				error:`Line number ${lineNum} is out of range for insert (valid range: 1-${lines.length+1})`,
			}
		}
	}else{
		if(lineNum < 1 || lineNum > lines.length + 1){
			return {
				isValid: false,
				error:`Line number ${lineNum} is out of range for insert (valid range: 1-${lines.length+1})`,
			}
		}
		if(actualEndline < lineNum || actualEndline > lines.length){
			return {
				isValid: false,
				error: `End line ${actualEndline} is out of range or before start line`,
			}
		}
	}

	if (mode === 'move') {
		if(!targetLine || targetLine < 1 || targetLine > lines.length+1){
			return {
				isValid: false,
				error:`Target line ${targetLine} is invalid`,
			}
		}
	}

	return {
		isValid: true
	};
}
