export interface RunCommand {
	type: 'RUN_COMMAND';
	command: string;
}

interface OutputReceived {
	type: 'OUTPUT_RECEIVED';
	output: string;
}

interface InputRequired {
	type: 'INPUT_REQUIRED';
}

interface InputReceived {
	type: 'INPUT_RECEIVED';
	input: string;
}

interface Finished {
	type: 'FINISHED';
}

export type Action =
	| RunCommand
	| OutputReceived
	| InputRequired
	| InputReceived
	| Finished;

export const runCommand = (command: string): RunCommand => ({type: 'RUN_COMMAND', command});
export const outputReceived = (output: string): OutputReceived => ({type: 'OUTPUT_RECEIVED', output});
export const inputRequired = (): InputRequired => ({type: 'INPUT_REQUIRED'});
export const inputReceived = (input: string): InputReceived => ({type: 'INPUT_RECEIVED', input});
export const finished = (): Finished => ({type: 'FINISHED'});
