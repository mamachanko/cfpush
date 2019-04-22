import {Action, EXIT_APP, finished, inputRequired, INPUT_RECEIVED, RUN_COMMAND, started, stdoutReceived} from './actions';
import {execute, ExitHandler, RunningCommand, StderrHandler, StdoutHandler} from './exec';
import {logger} from './logging';
import {Middleware} from './middleware';
import {uid as defaultUid} from './uid';

export const createCommandRuntimeMiddleware = (run = execute, uid = defaultUid): Middleware => store => {
	let runningCommand: RunningCommand;

	const stdoutHandler: StdoutHandler = (data: string): void => {
		const output = String(data);
		store.dispatch(stdoutReceived({text: output, uid: uid()}));
		if (output.endsWith('> ')) {
			store.dispatch(inputRequired());
		}
	};

	const stderrHandler: StderrHandler = (data: string): void => {
		logger.error(`command stderr: ${data}`);
	};

	const exitHandler: ExitHandler = (exitCode: number): void => {
		store.dispatch(finished(exitCode ? new Error() : null));
	};

	const handlers = {
		stdout: [stdoutHandler],
		stderr: [stderrHandler],
		exit: [exitHandler]
	};

	return next => (action: Action) => {
		switch (action.type) {
			case (RUN_COMMAND): {
				const {filename, args} = store.getState().pages.current.command;
				runningCommand = run({filename, args}, handlers);
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
