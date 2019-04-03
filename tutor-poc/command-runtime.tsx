import {spawn} from 'child_process';
import {Middleware} from 'redux';
import {finished, inputRequired, outputReceived} from './actions';

export const commandRuntime = (spawnChildProcess = spawn, childProcess = null): Middleware => {
	return store => {
		const runCommand = runner(store, spawnChildProcess);

		if (childProcess !== null) {
			subscribe(store.dispatch, childProcess);
		}

		return next => action => {
			if (action.type === 'RUN_COMMAND') {
				if (store.getState().dry) {
					next(action);
					store.dispatch(outputReceived(`pretending to run "${action.command}"`));
					store.dispatch(finished());
					return;
				}

				childProcess = runCommand(action.command);
				subscribe(store.dispatch, childProcess);
			}

			if (action.type === 'INPUT_RECEIVED') {
				childProcess.stdin.write(`${action.input}\n`);
			}

			next(action);
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
