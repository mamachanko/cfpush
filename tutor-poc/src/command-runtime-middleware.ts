import {Middleware, Dispatch} from 'redux';
import {Action, EXIT_APP, finished, inputRequired, INPUT_RECEIVED, outputReceived, RUN_COMMAND, started} from './actions'; // eslint-disable-line import/named
import {CommandOptions, execute, ExitHandler, RunningCommand, StderrHandler, StdoutHandler} from './exec'; // eslint-disable-line import/named
import {logger} from './logging';
import {State} from './reducer';
import {uid as defaultUid} from './uid';

const parseCommand = (command: string): CommandOptions => {
	const [filename, ...args] = command.split(' ');
	return {filename, args};
};

export const createCommandRuntimeMiddleware = (run = execute, uid = defaultUid): Middleware<{}, State, Dispatch<Action>> => {
	return store => {
		let runningCommand: RunningCommand;

		const stdoutHandler: StdoutHandler = (data: string): void => {
			const output = String(data);
			store.dispatch(outputReceived(output, uid()));
			if (output.endsWith('> ')) {
				store.dispatch(inputRequired());
			}
		};

		const stderrHandler: StderrHandler = (data: string): void => {
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

		return next => (action: Action) => {
			switch (action.type) {
				case (RUN_COMMAND): {
					const {command} = store.getState().commands.current;
					runningCommand = run(
						parseCommand(command),
						handlers
					);
					store.dispatch(started());
					break;
				}

				case (INPUT_RECEIVED): {
					runningCommand.write(`${action.payload.input}\n`);
					break;
				}

				case (EXIT_APP): {
					if (runningCommand != null) { // eslint-disable-line no-eq-null, eqeqeq
						runningCommand.cancel();
					}

					break;
				}

				// No default
			}

			next(action);
		};
	};
};
