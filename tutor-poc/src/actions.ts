
export const RUN_COMMAND = 'RUN_COMMAND';
export interface RunCommand {
	type: typeof RUN_COMMAND;
}

export const OUTPUT_RECEIVED = 'OUTPUT_RECEIVED';
export interface OutputReceived {
	type: typeof OUTPUT_RECEIVED;
	payload: {
		output: string;
		uid: string;
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

export const COMPLETED = 'COMPLETED';
export interface Completed {
	type: typeof COMPLETED;
}

export type Action =
	| RunCommand
	| OutputReceived
	| InputRequired
	| InputReceived
	| Finished
	| Completed;

export const runCommand = (): RunCommand => ({type: RUN_COMMAND});
export const outputReceived = (output: string, uid: string): OutputReceived => ({type: OUTPUT_RECEIVED, payload: {output, uid}});
export const inputRequired = (): InputRequired => ({type: INPUT_REQUIRED});
export const inputReceived = (input: string): InputReceived => ({type: INPUT_RECEIVED, payload: {input}});
export const finished = (): Finished => ({type: FINISHED});
export const completed = (): Completed => ({type: COMPLETED});
