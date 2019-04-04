
export const RUN_COMMAND = 'RUN_COMMAND';
export interface RunCommand {
	type: typeof RUN_COMMAND;
	payload: {
		command: string;
	};
}

export const OUTPUT_RECEIVED = 'OUTPUT_RECEIVED';
export interface OutputReceived {
	type: typeof OUTPUT_RECEIVED;
	payload: {
		output: string;
	};
}

export const INPUT_REQUIRED = 'INPUT_REQUIRED';
export interface InputRequired {
	type: typeof INPUT_REQUIRED;
}

export const INPUT_RECEIVED = 'INPUT_RECEIVED';
export interface InputReceived {
	type: typeof INPUT_RECEIVED;
	payload: {
		input: string;
	};
}

export const FINISHED = 'FINISHED';
export interface Finished {
	type: typeof FINISHED;
}

export type Action =
	| RunCommand
	| OutputReceived
	| InputRequired
	| InputReceived
	| Finished;

export const runCommand = (command: string): RunCommand => ({type: 'RUN_COMMAND', payload: {command}});
export const outputReceived = (output: string): OutputReceived => ({type: 'OUTPUT_RECEIVED', payload: {output}});
export const inputRequired = (): InputRequired => ({type: 'INPUT_REQUIRED'});
export const inputReceived = (input: string): InputReceived => ({type: 'INPUT_RECEIVED', payload: {input}});
export const finished = (): Finished => ({type: 'FINISHED'});
