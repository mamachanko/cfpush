import {Dispatch, Middleware} from 'redux';
import {v4 as uuid} from 'uuid';
import {Action, EXIT_APP, finished, inputRequired, INPUT_RECEIVED, outputReceived, RUN_COMMAND} from './actions'; // eslint-disable-line import/named
import {CommandOptions, execute, ExitHandler, RunningCommand, StderrHandler, StdoutHandler} from './exec'; // eslint-disable-line import/named
import {logger} from './logging';
import {State} from './reducer';

const defaultUidFactory = (): string => String(uuid());

export const commandRuntime = (run = execute, uid = defaultUidFactory): Middleware<{}, State, Dispatch<Action>> => {
	return store => {
		let runningCommand: RunningCommand;

		const isCi = (): boolean => store.getState().ci;
		const isDry = (): boolean => store.getState().dry;

		const stdoutHandler: StdoutHandler = (data: any): void => {
			const output = String(data);
			store.dispatch(outputReceived(output, uid()));
			if (output.endsWith('> ')) {
				store.dispatch(inputRequired());
			}
		};

		const stderrHandler: StderrHandler = (data: any): void => {
			logger.error(`command stderr: ${data}`);
		};

		const exitHandler: ExitHandler = (): void => {
			store.dispatch(finished());
		};

		const handlers = {
			stdout: [stdoutHandler],
			stderr: [stderrHandler],
			exit: [exitHandler]
		};

		const dryRun = (command: string): void => {
			store.dispatch(outputReceived(`pretending to run "${command}"`, uid()));
			store.dispatch(finished());
		};

		return next => (action: Action) => {
			switch (action.type) {
				case (RUN_COMMAND): {
					const {command} = store.getState().commands.current;
					if (isDry()) {
						next(action);
						dryRun(command);
						break;
					}

					const commandOptions = parseCommand(command, isCi());
					runningCommand = run(commandOptions, handlers);
					next(action);
					break;
				}

				case (INPUT_RECEIVED): {
					runningCommand.write(`${action.payload.input}\n`);
					next(action);
					break;
				}

				case (EXIT_APP): {
					if (runningCommand != null) { // eslint-disable-line no-eq-null, eqeqeq
						runningCommand.cancel();
					}

					next(action);
					break;
				}

				default: next(action);
			}
		};
	};
};

const parseCommand = (command: string, isCi: boolean): CommandOptions => {
	let filename: string;
	let args: ReadonlyArray<string>;

	if (isCi && isCfLogin(command)) {
		[filename, ...args] = cfCiLogin();
	} else {
		[filename, ...args] = command.split(' ');
	}

	return {filename, args};
};

const isCfLogin = (command: string): ReadonlyArray<string> => command.match(/cf\s+login/);

const cfCiLogin = (): ReadonlyArray<string> => [
	'cf',
	'login',
	'-a',
	'api.run.pivotal.io',
	'-u',
	process.env.CF_USERNAME,
	'-p',
	process.env.CF_PASSWORD,
	'-o',
	process.env.CF_ORG,
	'-s',
	process.env.CF_SPACE
];
