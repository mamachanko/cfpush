import {spawn} from 'child_process';
import {Middleware} from 'redux';
import {finished, inputRequired, outputReceived} from './actions';

export const commandRuntime = (spawnChildProcess = spawn, childProcess = null): Middleware => {
	return store => {
		const subscribe = (): void => {
			childProcess.stdout.on('data', (data: any) => {
				const output = String(data);
				store.dispatch(outputReceived(output));
				if (output.endsWith('> ')) {
					store.dispatch(inputRequired());
				}
			});

			childProcess.on('exit', (code: number) => {
				store.dispatch(finished(code));
				childProcess = null;
			});
		};

		if (childProcess !== null) {
			subscribe();
		}

		return next => action => {
			if (action.type === 'RUN_COMMAND') {
				if (store.getState().fakeCommands) {
					next(action);
					store.dispatch(outputReceived(`pretending to run "${action.command}"`));
					store.dispatch(finished(0));
					return;
				}

				const [filename, ...args] = action.command.split(' ');
				childProcess = spawnChildProcess(filename, args);
				subscribe();
			}

			if (action.type === 'INPUT_RECEIVED') {
				childProcess.stdin.write(`${action.input}\n`);
			}

			next(action);
		};
	};
};
