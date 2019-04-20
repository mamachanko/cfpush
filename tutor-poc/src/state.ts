
export type State = {
	app: App;
	cloudFoundryContext: CloudFoundryContext;
	pages: Pages;
}

type App = {
	waitForTrigger: boolean;
	pinOutput: boolean;
	exit: boolean;
}

type CloudFoundryContext = any;

export type Pages = {
	completed: Page<CompletedCommand>[];
	current: Page<CurrentCommand>;
	next: Page<Command>[];
}

export type Page<T = Command | CurrentCommand | CompletedCommand> = {
	title?: string;
	subtitle?: string;
	text: string;
	command?: T;
}

export type Command = {
	filename: string;
	args: string[];
}

type CompletedCommand =
	& Command
	& HasStdout;

export type CurrentCommand =
	& Command
	& HasStdout
	& HasStatus;

type HasStdout = {
	stdout: Stdout;
}

export type Stdout = Output[];

export type Output = {
	text: string;
	uid: string;
}

type HasStatus = {
	status: Status;
}

export type Status =
	| typeof UNSTARTED
	| typeof RUNNING
	| typeof INPUT_REQUIRED
	| typeof FINISHED;

export const UNSTARTED = 'UNSTARTED';
export const RUNNING = 'RUNNING';
export const INPUT_REQUIRED = 'INPUT_REQUIRED';
export const FINISHED = 'FINISHED';
