
type Command = string;
type Text = string;

export interface Page {
	command: Command;
	text: Text;
}

export type Output = {
	text: Text;
	uid: string;
}

interface CompletedPage extends Page {
	output: ReadonlyArray<Output>;
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
	output: ReadonlyArray<Output>;
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
