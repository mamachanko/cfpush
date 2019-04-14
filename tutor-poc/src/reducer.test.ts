import {completed, exitApp, finished, inputReceived, inputRequired, INPUT_REQUIRED, outputReceived, started, updateCfContext} from './actions';
import {FINISHED, RUNNING, UNSTARTED} from './command-status';
import {reducer, State} from './reducer';

const defaultState: State = {
	app: {
		waitForTrigger: false,
		exit: false
	},
	cfContext: {},
	commands: {
		completed: [],
		current: {
			command: 'command one',
			status: UNSTARTED,
			output: []
		},
		next: ['command two', 'command three']
	}
};

describe('reducer', () => {
	describe('when a command starts', () => {
		it('changes the current command\'s status to "RUNNING"', () => {
			const nextState = reducer(defaultState, started());

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						status: RUNNING
					}
				}
			});
		});
	});

	describe('when output is received', () => {
		it('appends to the current command\'s empty output', () => {
			const nextState = reducer(defaultState, outputReceived('new command output', 'uid 123'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: [{text: 'new command output', uid: 'uid 123'}]
					}
				}
			});
		});

		it('appends to the current command\'s output', () => {
			const nextState = reducer({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: [{text: 'existing command output', uid: 'uid 0'}]
					}
				}
			}, outputReceived('new command output', 'uid 1'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: [
							{text: 'existing command output', uid: 'uid 0'},
							{text: 'new command output', uid: 'uid 1'}
						]
					}
				}
			});
		});

		it('initialises from null', () => {
			const nextState = reducer({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: null
					}
				}
			}, outputReceived('new command output', 'uid 123'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: [{text: 'new command output', uid: 'uid 123'}]
					}
				}
			});
		});
	});

	describe('when input is required', () => {
		it('changes the current command\'s status to "INPUT_REQUIRED"', () => {
			const nextState = reducer(defaultState, inputRequired());

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						status: INPUT_REQUIRED
					}
				}
			});
		});
	});

	describe('when input is received', () => {
		it('changes the current command\'s status to "RUNNING"', () => {
			const nextState = reducer(defaultState, inputReceived('input for command'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						status: RUNNING
					}
				}
			});
		});
	});

	describe('when a command finishes', () => {
		it('changes the current command\'s status to "FINISHED"', () => {
			const nextState = reducer(defaultState, finished('this is currently ignored'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						status: FINISHED
					}
				}
			});
		});
	});

	describe('when completing a command', () => {
		it('completes the current command and sets the next current command', () => {
			const nextState = reducer({
				...defaultState,
				commands: {
					...defaultState.commands,
					completed: [{
						command: 'command zero',
						output: ['existing command output 1', 'existing command output 2']
					}],
					current: {
						...defaultState.commands.current,
						status: FINISHED,
						output: ['existing command output 1', 'existing command output 2']
					}
				}
			}, completed());

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					completed: [{
						command: 'command zero',
						output: ['existing command output 1', 'existing command output 2']
					}, {
						command: 'command one',
						output: ['existing command output 1', 'existing command output 2']
					}],
					current: {
						...defaultState.commands.current,
						command: 'command two',
						output: [],
						status: UNSTARTED
					},
					next: ['command three']
				}
			});
		});

		describe('when completing the first command', () => {
			it('completes the current command and sets the next current command', () => {
				const nextState = reducer({
					...defaultState,
					commands: {
						...defaultState.commands,
						current: {
							...defaultState.commands.current,
							status: FINISHED,
							output: ['existing command output 1', 'existing command output 2']
						}
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					commands: {
						...defaultState.commands,
						completed: [{
							command: 'command one',
							output: ['existing command output 1', 'existing command output 2']
						}],
						current: {
							...defaultState.commands.current,
							command: 'command two',
							output: [],
							status: UNSTARTED
						},
						next: ['command three']
					}
				});
			});
		});

		describe('when completing the last command', () => {
			it('completes the current command and sets the current command to undefined', () => {
				const nextState = reducer({
					...defaultState,
					commands: {
						...defaultState.commands,
						current: {
							...defaultState.commands.current,
							status: FINISHED,
							output: ['existing command output 1', 'existing command output 2']
						},
						next: []
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					commands: {
						...defaultState.commands,
						completed: [{
							command: 'command one',
							output: ['existing command output 1', 'existing command output 2']
						}],
						current: undefined,
						next: []
					}
				});
			});
		});

		describe('when the next command contains a placeholder', () => {
			it('completes the current command, renders the next command it using the cf context and sets it as current', () => {
				const nextState = reducer({
					...defaultState,
					cfContext: {
						here: {
							is: {
								some: 'context'
							}
						}
					},
					commands: {
						...defaultState.commands,
						next: ['this command needs {{here.is.some}} to be rendered']
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					cfContext: {
						here: {
							is: {
								some: 'context'
							}
						}
					},
					commands: {
						completed: [{command: 'command one', output: []}],
						current: {
							command: 'this command needs context to be rendered',
							status: 'UNSTARTED',
							output: []
						},
						next: []
					}
				});
			});
		});
	});

	describe('when cf context is updated', () => {
		it('updates the cf context', () => {
			const nextState = reducer(defaultState, updateCfContext({this: {is: {a: {cf: {context: 'update'}}}}}));

			expect(nextState).toStrictEqual({
				...defaultState,
				cfContext: {this: {is: {a: {cf: {context: 'update'}}}}}
			});
		});

		describe('when cf context exists already', () => {
			it('merges the cf context update', () => {
				const nextState = reducer({
					...defaultState,
					cfContext: {test: {numbers: {1: 'one', 3: 'three'}}}
				}, updateCfContext({test: {numbers: {2: 'two'}}}));

				expect(nextState).toStrictEqual({
					...defaultState,
					cfContext: {test: {numbers: {1: 'one', 2: 'two', 3: 'three'}}}
				});
			});
		});
	});

	describe('when exiting the app', () => {
		it('sets exit to true', () => {
			const nextState = reducer(defaultState, exitApp());

			expect(nextState).toStrictEqual({...defaultState, app: {...defaultState.app, exit: true}});
		});
	});
});
