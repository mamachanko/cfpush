import {spawn} from 'child_process';
import {Middleware, Dispatch} from 'redux';
import {Action, finished, inputRequired, INPUT_RECEIVED, outputReceived, RUN_COMMAND} from './actions'; // eslint-disable-line import/named
import {State} from './reducer';

export const commandRuntime = (spawnChildProcess = spawn, childProcess = null): Middleware<{}, State, Dispatch<Action>> => {
	return store => {
		const runCommand = runner(store, spawnChildProcess);

		if (childProcess) {
			subscribe(store.dispatch, childProcess);
		}

		return next => (action: Action) => {
			switch (action.type) {
				case (RUN_COMMAND): {
					const {command} = action.payload;
					if (store.getState().dry) {
						next(action);
						store.dispatch(outputReceived(`pretending to run "${command}"`));
						store.dispatch(finished());
						break;
					}

					childProcess = runCommand(command);
					subscribe(store.dispatch, childProcess);
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

const subscribe = (dispatch, childProcess): void => {
	childProcess.stdout.on('data', (data: any) => {
		const output = String(data);
		dispatch(outputReceived(output));
		if (output.endsWith('> ')) {
			dispatch(inputRequired());
		}
	});

	childProcess.on('exit', () => {
		dispatch(finished());
		childProcess = null;
	});
};
