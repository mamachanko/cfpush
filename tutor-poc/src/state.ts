
export type State = {
	app: App;
	cloudFoundryContext: CloudFoundryContext;
	pages: Pages;
}

type App = {
	waitForTrigger: boolean;
	exit: boolean;
}

type CloudFoundryContext = any;

type Pages = {
	completed: CompletedPage[];
	current: CurrentPage;
	next: Page[];
}

export type Page = {
	title?: string;
	subtitle?: string;
	text: string;
	command: string;
}

interface CompletedPage extends Page {
	output: ReadonlyArray<CommandOutput>;
}

export interface CurrentPage extends Page {
	commandStatus: CommandStatus;
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

export type CommandOutput = {
	text: string;
	uid: string;
}
