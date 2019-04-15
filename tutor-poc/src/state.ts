import * as CommandStatus from './command-status';

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

export interface CurrentPage extends Page {
	status: CommandStatus.CommandStatus;
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
