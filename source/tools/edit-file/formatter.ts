import React from "react";
import { ThemeContext } from "../../hooks/useTheme.js";



const EditFileFormatter = React.memo(({args, result}: {args:any, result?:string}) => {
	const {colors} = React.useContext(ThemeContext);
	const [preview, setPreview] = React.useState<React.ReactElement | null>(null);

	React.useEffect(() => {
		const generatePreview = async() => {
			const formattedPreview = await formatEditPreviewInternal(args, result, colors);
			setPreview(formattedPreview);
		};
		generatePreview();
	}, [args, result, colors]);
	return preview;
});

async function formatEditPreviewInternal(){
	
}



export async function formatEditPreview(args: any, result?: string): Promise<React.ReactElement>{
	return <EditFileFormatter args={args} result={result} />
}
