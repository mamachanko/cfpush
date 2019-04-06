import {Dispatch, MiddlewareAPI} from 'redux';
import {Action, finished, inputReceived, inputRequired, outputReceived, runCommand} from './actions'; // eslint-disable-line import/named
import {commandRuntime} from './command-runtime';
import {State, initialState} from './reducer';

const createStoreMock = (state: State = initialState): MiddlewareAPI<Dispatch<Action>, State> => ({
	dispatch: jest.fn(),
	// IDEA: this shouldn't have a dependency on reducer
	// maybe there's another way to create State
	getState: (): State => state
});

// IDEA: introduce childprocess type
const createChildProcessMock = (): any => {
	const listeners = {
		stdout: null,
		exit: null
	};
	return {
		stdout: {
			on: (event: string, callback: (output: any) => void) => {
				if (event !== 'data') {
					throw new Error(`unexpected event listener on '${event}'. expected 'data'.`);
				}

				if (listeners.stdout !== null) {
					throw new Error('event listener on stdout \'data\' already exists');
				}

				listeners.stdout = callback;
			},
			emit: (output: any) => {
				listeners.stdout(output);
			}
		},
		stdin: {
			write: jest.fn()
		},
		stderr: {
			on: () => {}
		},
		on: (event: string, callback: (output: string) => void) => {
			if (event !== 'exit') {
				throw new Error(`unexpected event listener on '${event}'. expected 'exit'.`);
			}

			if (listeners.exit !== null) {
				throw new Error('event listener on \'exit\' already exists');
			}

			listeners.exit = callback;
		},
		exit: (exitCode: number) => {
			listeners.exit(exitCode);
		}
	};
};

describe('CommandRuntimeMiddleware', () => {
	describe('when in tutorial mode', () => {
		let storeMock: MiddlewareAPI;

		beforeEach(() => {
			storeMock = createStoreMock({
				ci: false,
				dry: false,
				commands: {
					completed: [],
					current: {
						command: 'test-command --flag --positional arg',
						status: 'UNSTARTED',
						output: []
					},
					next: []
				}
			});
		});

		it('starts to run a command', () => {
			const nextMiddlewareMock = jest.fn();
			const childProcessMock = createChildProcessMock();
			const spawnMock = jest.fn().mockReturnValueOnce(childProcessMock);

			commandRuntime(spawnMock)(storeMock)(nextMiddlewareMock)(runCommand());

			expect(spawnMock).toHaveBeenLastCalledWith('test-command', ['--flag', '--positional', 'arg']);
			expect(spawnMock).toHaveBeenCalledTimes(1);

			expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand());
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});

		it('emits command output', () => {
			const subshell = createChildProcessMock();

			commandRuntime(null, subshell)(storeMock);

			subshell.stdout.emit('test command output');

			expect(storeMock.dispatch).toHaveBeenCalledWith(outputReceived('test command output'));
			expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
		});

		it('emits command input required', () => {
			const childProcessMock = createChildProcessMock();

			commandRuntime(null, childProcessMock)(storeMock);

			childProcessMock.stdout.emit('input required > ');

			expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, outputReceived('input required > '));
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, inputRequired());
			expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
		});

		it('emits command finished', () => {
			const childProcessMock = createChildProcessMock();

			commandRuntime(null, childProcessMock)(storeMock);

			childProcessMock.exit(123);

			expect(storeMock.dispatch).toHaveBeenCalledWith(finished());
			expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
		});

		it('provides user input to command', () => {
			const childProcessMock = createChildProcessMock();
			const nextMiddlewareMock = jest.fn();

			commandRuntime(null, childProcessMock)(storeMock)(nextMiddlewareMock)(inputReceived('test user input'));

			expect(childProcessMock.stdin.write).toHaveBeenCalledWith('test user input\n');
			expect(childProcessMock.stdin.write).toHaveBeenCalledTimes(1);
			expect(nextMiddlewareMock).toHaveBeenCalledWith(inputReceived('test user input'));
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('when in dry mode', () => {
		const storeMock = createStoreMock({
			ci: false,
			dry: true,
			commands: {
				completed: [],
				current: {
					command: 'test-command --flag --positional arg',
					status: 'UNSTARTED',
					output: []
				},
				next: []
			}
		});

		it('pretends to run a command', () => {
			const nextMiddlewareMock = jest.fn();
			const childProcessMock = createChildProcessMock();
			const spawnMock = jest.fn().mockReturnValueOnce(childProcessMock);

			commandRuntime(spawnMock)(storeMock)(nextMiddlewareMock)(runCommand());

			expect(spawnMock).toHaveBeenCalledTimes(0);

			expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, outputReceived('pretending to run "test-command --flag --positional arg"'));
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, finished());
			expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
			expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand());
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('when in ci mode and current command is cf login', () => {
		let storeMock: MiddlewareAPI;

		beforeEach(() => {
			storeMock = createStoreMock({
				ci: true,
				dry: false,
				commands: {
					completed: [],
					current: {
						command: 'cf login --any --args --go --here',
						status: 'UNSTARTED',
						output: []
					},
					next: []
				}
			});
		});

		it('avoids user input by taking credentials from the environment', () => {
			const nextMiddlewareMock = jest.fn();
			const runCommandAction = runCommand();
			const childProcessMock = createChildProcessMock();
			const spawnMock = jest.fn().mockReturnValueOnce(childProcessMock);

			process.env.CF_USERNAME = 'cf-user';
			process.env.CF_PASSWORD = 'cf-password';
			process.env.CF_ORG = 'cf-org';
			process.env.CF_SPACE = 'cf-space';

			commandRuntime(spawnMock)(storeMock)(nextMiddlewareMock)(runCommandAction);

			expect(spawnMock).toHaveBeenCalledWith('cf', ['login', '-a', 'api.run.pivotal.io', '-u', 'cf-user', '-p', 'cf-password', '-o', 'cf-org', '-s', 'cf-space']);
			expect(spawnMock).toHaveBeenCalledTimes(1);
			expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand());
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});
});
