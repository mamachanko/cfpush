import {Dispatch, Middleware} from 'redux';
import {v4 as uuid} from 'uuid';
import {Action, finished, inputRequired, INPUT_RECEIVED, outputReceived, RUN_COMMAND, EXIT_APP} from './actions'; // eslint-disable-line import/named
import {CommandOptions, execute, ExitHandler, StderrHandler, StdoutHandler, WriteToStdin} from './exec'; // eslint-disable-line import/named
import {logger} from './logging';
import {State} from './reducer';

const defaultUidFactory = (): string => String(uuid());

export const commandRuntime = (run = execute, uid = defaultUidFactory): Middleware<{}, State, Dispatch<Action>> => {
	return store => {
		let write: WriteToStdin;
		let kill: () => void;

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

					({write, kill} = run(parseCommand(command, isCi()), handlers));
					next(action);
					break;
				}

				case (INPUT_RECEIVED): {
					write(`${action.payload.input}\n`);
					next(action);
					break;
				}

				case (EXIT_APP): {
					if (kill === undefined) {
						logger.debug('not killing in-flight command');
					} else {
						logger.debug('killing in-flight command');
						kill();
					}

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
