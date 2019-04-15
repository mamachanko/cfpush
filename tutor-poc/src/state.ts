import * as CommandStatus from './command-status';

type Command = string;

export type Output = {
	text: string;
	uid: string;
}

interface CompletedCommand {
	command: Command;
	output: ReadonlyArray<Output>;
}

export interface CurrentCommand {
	command: Command;
	status: CommandStatus.CommandStatus;
	output: ReadonlyArray<Output>;
}

interface Commands {
	completed: ReadonlyArray<CompletedCommand>;
	current: CurrentCommand;
	next: ReadonlyArray<Command>;
}

type App = {
	waitForTrigger: boolean;
	exit: boolean;
}

type CloudFoundryContext = any;

export interface State {
	app: App;
	cloudFoundryContext: CloudFoundryContext;
	commands: Commands;
}
