import {MiddlewareAPI} from 'redux';
import {finished, inputReceived, inputRequired, stdoutReceived, runCommand, exitApp, started} from './actions';
import {createCommandRuntimeMiddleware} from './command-runtime-middleware';
import {ExitHandler, StdoutHandler, CommandRunner, WriteToStdin, RunningCommand} from './exec'; // eslint-disable-line import/named
import {createStoreMock} from './test-utils';
import {UNSTARTED} from './state';

const uidDummy = (): string => 'test-uid';

describe('CommandRuntimeMiddleware', () => {
	let sut;

	let executeMock: CommandRunner;
	let stdoutMock: WriteToStdin;
	let exitCommand: () => void;
	const writeStub: (input: string) => void = jest.fn();
	const cancelStub: () => void = jest.fn();

	let storeMock: MiddlewareAPI;
	const nextMiddlewareMock = jest.fn();

	afterEach(() => {
		jest.resetAllMocks();
	});

	beforeEach(() => {
		const executeDummy: CommandRunner = (command, handlers): RunningCommand => {
			stdoutMock = (text: string) =>
				handlers.stdout.map((stdoutHandler: StdoutHandler) => stdoutHandler(text));

			exitCommand = () =>
				handlers.exit.map((exitHandler: ExitHandler) => exitHandler());

			return {write: writeStub, cancel: cancelStub};
		};

		executeMock = jest.fn().mockImplementationOnce(executeDummy);

		storeMock = createStoreMock({
			pages: {
				completed: [],
				current: {
					text: 'Let us run a test command.',
					command: {
						filename: 'test-command',
						args: ['--flag', '--positional', 'arg'],
						status: UNSTARTED,
						stdout: []
					}
				},
				next: []
			}
		});

		sut = createCommandRuntimeMiddleware(executeMock, uidDummy)(storeMock)(nextMiddlewareMock);
	});

	describe('when running a command', () => {
		beforeEach(() => {
			sut(runCommand());
		});

		it('starts to run a command', () => {
			expect(executeMock).toHaveBeenLastCalledWith({filename: 'test-command', args: ['--flag', '--positional', 'arg']}, expect.any(Object));
			expect(executeMock).toHaveBeenCalledTimes(1);
		});

		it('emits the command has started', () => {
			expect(storeMock.dispatch).toHaveBeenCalledWith(started());
			expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
		});

		it('calls the next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand());
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});

		describe('when the command writes to stdout', () => {
			beforeEach(() => {
				stdoutMock('test command output');
			});

			it('emits output with uid', () => {
				expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, stdoutReceived({text: 'test command output', uid: 'test-uid'}));
				expect(storeMock.dispatch).toHaveBeenCalledTimes(2); // Previous calls exist
			});
		});

		describe('when command waits for input', () => {
			beforeEach(() => {
				stdoutMock('input required > ');
			});

			it('emits input required, output and assigns uid', () => {
				expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, stdoutReceived({text: 'input required > ', uid: 'test-uid'}));
				expect(storeMock.dispatch).toHaveBeenNthCalledWith(3, inputRequired());
				expect(storeMock.dispatch).toHaveBeenCalledTimes(3); // Previous calls exist
			});

			describe('when user provides input', () => {
				beforeEach(() => {
					sut(inputReceived('test user input'));
				});

				it('writes to command stdin', () => {
					expect(writeStub).toHaveBeenCalledWith('test user input\n');
					expect(writeStub).toHaveBeenCalledTimes(1);
				});

				it('calls next middleware', () => {
					expect(nextMiddlewareMock).toHaveBeenCalledWith(inputReceived('test user input'));
					expect(nextMiddlewareMock).toHaveBeenCalledTimes(2); // Previous calls exist
				});
			});
		});

		describe('when command finishes', () => {
			beforeEach(() => {
				exitCommand();
			});

			it('emits command finished', () => {
				expect(storeMock.dispatch).toHaveBeenCalledWith(finished());
				expect(storeMock.dispatch).toHaveBeenCalledTimes(2); // Previous calls exist
			});
		});

		describe('when exiting the app', () => {
			beforeEach(() => {
				sut(exitApp());
			});

			it('cancels the running command', () => {
				expect(cancelStub).toHaveBeenCalledTimes(1);
			});

			it('calls next middleware', () => {
				expect(nextMiddlewareMock).toHaveBeenCalledWith(exitApp());
				expect(nextMiddlewareMock).toHaveBeenCalledTimes(2); // Previous calls exist
			});
		});
	});

	describe('when exiting the app', () => {
		beforeEach(() => {
			sut(exitApp());
		});

		it('calls next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(exitApp());
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});
});
