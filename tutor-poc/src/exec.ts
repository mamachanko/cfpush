import * as execa from 'execa';
import {Command} from './state'; // eslint-disable-line import/named

export type StdoutHandler = (data: string) => void;
export type ExitHandler = () => void;
export type StderrHandler = (data: string) => void;

export type StdHandlers = {
	stdout: ReadonlyArray<StdoutHandler>;
	stderr: ReadonlyArray<StderrHandler>;
	exit: ReadonlyArray<ExitHandler>;
}

export type WriteToStdin = (input: string) => void;
export type Cancel = () => void;

export type RunningCommand = {
	write: WriteToStdin;
	cancel: Cancel;
}

export type CommandRunner = (command: Command, handlers: StdHandlers) => RunningCommand;

const executionOptions: execa.Options = {
	cleanup: true
};

export const execute: CommandRunner = (command: Command, handlers: StdHandlers): RunningCommand => {
	const childProcess = execa(command.filename, command.args, executionOptions);
	const {stdin, stdout, stderr} = childProcess;

	handlers.stdout.map(stdoutHandler => stdout.on('data', stdoutHandler));
	handlers.stderr.map(stderrHandler => stderr.on('data', stderrHandler));
	handlers.exit.map(exitHandler => childProcess.on('exit', exitHandler));

	return {
		write: (input: string) => stdin.write(input),
		cancel: () => childProcess.kill('SIGTERM')
	};
};
