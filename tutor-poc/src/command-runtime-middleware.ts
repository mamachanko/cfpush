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

const unparseCommand = (command: CommandOptions): string => {
	return [command.filename, ...command.args].join(' ');
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

		const exitHandler: ExitHandler = (command: CommandOptions): void => {
			store.dispatch(finished(unparseCommand(command)));
		};

		const handlers = {
			stdout: [stdoutHandler],
			stderr: [stderrHandler],
			exit: [exitHandler]
		};

		return next => (action: Action) => {
			switch (action.type) {
				case (RUN_COMMAND): {
					runningCommand = run(
						parseCommand(action.payload.command),
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

				default: break;
			}

			next(action);
		};
	};
};
