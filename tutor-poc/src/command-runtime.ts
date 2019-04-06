import {spawn} from 'child_process';
import {Middleware, Dispatch} from 'redux';
import {v4 as uuid} from 'uuid';
import {Action, finished, inputRequired, INPUT_RECEIVED, outputReceived, RUN_COMMAND} from './actions'; // eslint-disable-line import/named
import {State} from './reducer';
import {logger} from './logging';

const defaultUidFactory = (): string => String(uuid());

export const commandRuntime = (spawnChildProcess = spawn, childProcess = null, uidFactory = defaultUidFactory): Middleware<{}, State, Dispatch<Action>> => {
	return store => {
		const runCommand = runner(store, spawnChildProcess);

		if (childProcess) {
			subscribe(store.dispatch, childProcess, uidFactory);
		}

		return next => (action: Action) => {
			switch (action.type) {
				case (RUN_COMMAND): {
					const {command} = store.getState().commands.current;
					if (store.getState().dry) {
						next(action);
						store.dispatch(outputReceived(`pretending to run "${command}"`, uidFactory()));
						store.dispatch(finished());
						break;
					}

					childProcess = runCommand(command);
					subscribe(store.dispatch, childProcess, uidFactory);
					next(action);
					break;
				}

				case (INPUT_RECEIVED): {
					childProcess.stdin.write(`${action.payload.input}\n`);
					next(action);
					break;
				}

				default: next(action);
			}
		};
	};
};

/* eslint-disable array-element-newline */
const cfCiLogin = (): ReadonlyArray<string> => [
	'cf', 'login',
	'-a', 'api.run.pivotal.io',
	'-u', process.env.CF_USERNAME,
	'-p', process.env.CF_PASSWORD,
	'-o', process.env.CF_ORG,
	'-s', process.env.CF_SPACE
];
/* eslint-enable array-element-newline */

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const runner = (store, spawnChildProcess) => (command: string) => {
	let filename: string;
	let args: ReadonlyArray<string>;

	if (store.getState().ci && command.match(/cf\s+login/)) {
		[filename, ...args] = cfCiLogin();
	} else {
		[filename, ...args] = command.split(' ');
	}

	return spawnChildProcess(filename, args);
};

const subscribe = (dispatch, childProcess, uidFactory): void => {
	childProcess.stdout.on('data', (data: any) => {
		const output = String(data);
		dispatch(outputReceived(output, uidFactory()));
		if (output.endsWith('> ')) {
			dispatch(inputRequired());
		}
	});

	childProcess.stderr.on('data', (data: any) => {
		logger.error(`command stderr: ${data}`);
	});

	childProcess.on('exit', () => {
		dispatch(finished());
		childProcess = null;
	});
};
