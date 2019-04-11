/* eslint-disable max-nested-callbacks */

import {MiddlewareAPI} from 'redux';
import {finished, inputReceived, inputRequired, outputReceived, runCommand, exitApp} from './actions';
import {commandRuntime} from './command-runtime';
import {ExitHandler, StdoutHandler, CommandRunner, WriteToStdin, RunningCommand} from './exec'; // eslint-disable-line import/named
import {createStoreMock} from './test-utils';

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
		const executeDummy: CommandRunner = (_, handlers): RunningCommand => {
			stdoutMock = (text: string) =>
				handlers.stdout.map((stdoutHandler: StdoutHandler) => stdoutHandler(text));

			exitCommand = () =>
				handlers.exit.map((exitHandler: ExitHandler) => exitHandler());

			return {write: writeStub, cancel: cancelStub};
		};

		executeMock = jest.fn().mockImplementationOnce(executeDummy);
	});

	describe('when in tutorial mode', () => {
		beforeEach(() => {
			storeMock = createStoreMock({
				app: {
					ci: false,
					dry: false,
					exit: false
				},
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

			sut = commandRuntime(executeMock, uidDummy)(storeMock)(nextMiddlewareMock);
		});

		describe('when running a command', () => {
			beforeEach(() => {
				sut(runCommand());
			});

			it('starts to run a command', () => {
				expect(executeMock).toHaveBeenLastCalledWith({filename: 'test-command', args: ['--flag', '--positional', 'arg']}, expect.any(Object));
				expect(executeMock).toHaveBeenCalledTimes(1);
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
					expect(storeMock.dispatch).toHaveBeenCalledWith(outputReceived('test command output', 'test-uid'));
					expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
				});
			});

			describe('when command waits for input', () => {
				beforeEach(() => {
					stdoutMock('input required > ');
				});

				it('emits input required, output and assigns uid', () => {
					expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, outputReceived('input required > ', 'test-uid'));
					expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, inputRequired());
					expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
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

			describe('when command exits', () => {
				beforeEach(() => {
					exitCommand();
				});

				it('emits command finished', () => {
					expect(storeMock.dispatch).toHaveBeenCalledWith(finished());
					expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
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

		describe('when in dry mode', () => {
			beforeEach(() => {
				storeMock = createStoreMock({
					app: {
						ci: false,
						dry: true,
						exit: false
					},
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

				sut = commandRuntime(executeMock, uidDummy)(storeMock)(nextMiddlewareMock);
			});

			describe('when running a command', () => {
				beforeEach(() => {
					sut(runCommand());
				});

				it('pretends to run a command', () => {
					expect(executeMock).not.toHaveBeenCalled();
					expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, outputReceived('pretending to run "test-command --flag --positional arg"', 'test-uid'));
					expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, finished());
					expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
					expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand());
					expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe('when in ci mode', () => {
			beforeEach(() => {
				storeMock = createStoreMock({
					app: {
						ci: true,
						dry: false,
						exit: false
					},
					commands: {
						completed: [],
						current: {
							command: 'cf login --any further --args go --here',
							status: 'UNSTARTED',
							output: []
						},
						next: []
					}
				});

				sut = commandRuntime(executeMock, uidDummy)(storeMock)(nextMiddlewareMock);
			});

			describe('when running command "cf login"', () => {
				beforeEach(() => {
					process.env.CF_USERNAME = 'cf-user';
					process.env.CF_PASSWORD = 'cf-password';
					process.env.CF_ORG = 'cf-org';
					process.env.CF_SPACE = 'cf-space';

					sut(runCommand());
				});

				it('avoids user input by taking credentials from the environment', () => {
					expect(executeMock).toHaveBeenCalledWith(
						{filename: 'cf', args: ['login', '-a', 'api.run.pivotal.io', '-u', 'cf-user', '-p', 'cf-password', '-o', 'cf-org', '-s', 'cf-space']},
						expect.any(Object)
					);
					expect(executeMock).toHaveBeenCalledTimes(1);
				});

				it('calls the next middleware', () => {
					expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand());
					expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
				});
			});
		});
	});
});
