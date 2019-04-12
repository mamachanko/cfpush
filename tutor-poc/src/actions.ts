
export const RUN_COMMAND = 'RUN_COMMAND';
export interface RunCommand {
	type: typeof RUN_COMMAND;
	payload: {
		command: string;
	};
}

export const STARTED = 'STARTED';
export interface Started {
	type: typeof STARTED;
}

export const OUTPUT_RECEIVED = 'OUTPUT_RECEIVED';
export interface OutputReceived {
	type: typeof OUTPUT_RECEIVED;
	payload: {
		text: string;
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
	payload: {
		command: string;
	};
}

export const COMPLETED = 'COMPLETED';
export interface Completed {
	type: typeof COMPLETED;
}

export const EXIT_APP = 'EXIT_APP';
export interface ExitApp {
	type: typeof EXIT_APP;
}

export type Action =
	| RunCommand
	| Started
	| OutputReceived
	| InputRequired
	| InputReceived
	| Finished
	| Completed
	| ExitApp;

export const runCommand = (command: string): RunCommand => ({type: RUN_COMMAND, payload: {command}});
export const started = (): Started => ({type: STARTED});
export const outputReceived = (text: string, uid: string): OutputReceived => ({type: OUTPUT_RECEIVED, payload: {text, uid}});
export const inputRequired = (): InputRequired => ({type: INPUT_REQUIRED});
export const inputReceived = (input: string): InputReceived => ({type: INPUT_RECEIVED, payload: {input}});
export const finished = (command: string): Finished => ({type: FINISHED, payload: {command}});
export const completed = (): Completed => ({type: COMPLETED});
export const exitApp = (): ExitApp => ({type: EXIT_APP});
