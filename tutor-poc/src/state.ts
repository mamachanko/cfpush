
export interface Page {
	title?: string;
	text: string;
	command: string;
}

export type CommandOutput = {
	text: string;
	uid: string;
}

interface CompletedPage extends Page {
	output: ReadonlyArray<CommandOutput>;
}

export const UNSTARTED = 'UNSTARTED';
export const RUNNING = 'RUNNING';
export const INPUT_REQUIRED = 'INPUT_REQUIRED';
export const FINISHED = 'FINISHED';

export type CommandStatus =
	| typeof UNSTARTED
	| typeof RUNNING
	| typeof INPUT_REQUIRED
	| typeof FINISHED;

export interface CurrentPage extends Page {
	commandStatus: CommandStatus;
	output: ReadonlyArray<CommandOutput>;
}

interface Pages {
	completed: ReadonlyArray<CompletedPage>;
	current: CurrentPage;
	next: ReadonlyArray<Page>;
}

type App = {
	waitForTrigger: boolean;
	exit: boolean;
}

type CloudFoundryContext = any;

export interface State {
	app: App;
	cloudFoundryContext: CloudFoundryContext;
	pages: Pages;
}
