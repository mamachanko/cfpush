import {completed, exitApp, finished, inputReceived, inputRequired, INPUT_REQUIRED, outputReceived, started, updateCfContext} from './actions';
import {reducer} from './reducer';
import {State, UNSTARTED, RUNNING, FINISHED} from './state';

const defaultState: State = {
	app: {
		waitForTrigger: false,
		exit: false
	},
	cloudFoundryContext: {},
	pages: {
		completed: [],
		current: {
			text: 'The first page',
			command: 'command one',
			commandStatus: UNSTARTED,
			output: []
		},
		next: [
			{text: 'The second page', command: 'command two'},
			{text: 'The third page', command: 'command three'}
		]
	}
};

describe('reducer', () => {
	describe('when a command starts', () => {
		it('changes the current command\'s status to "RUNNING"', () => {
			const nextState = reducer(defaultState, started());

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						commandStatus: RUNNING
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
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						output: [{text: 'new command output', uid: 'uid 123'}]
					}
				}
			});
		});

		it('appends to the current command\'s output', () => {
			const nextState = reducer({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						output: [{text: 'existing command output', uid: 'uid 0'}]
					}
				}
			}, outputReceived('new command output', 'uid 1'));

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
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
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						output: null
					}
				}
			}, outputReceived('new command output', 'uid 123'));

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
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
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						commandStatus: INPUT_REQUIRED
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
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						commandStatus: RUNNING
					}
				}
			});
		});
	});

	describe('when a command finishes', () => {
		it('changes the current command\'s status to "FINISHED"', () => {
			const nextState = reducer(defaultState, finished());

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						commandStatus: FINISHED
					}
				}
			});
		});
	});

	describe('when completing a command', () => {
		it('completes the current command and sets the next current command', () => {
			const nextState = reducer({
				...defaultState,
				pages: {
					...defaultState.pages,
					completed: [{
						text: 'The zeroth page',
						command: 'command zero',
						output: ['existing command output 1', 'existing command output 2']
					}],
					current: {
						...defaultState.pages.current,
						commandStatus: FINISHED,
						output: ['existing command output 1', 'existing command output 2']
					}
				}
			}, completed());

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					completed: [{
						text: 'The zeroth page',
						command: 'command zero',
						output: ['existing command output 1', 'existing command output 2']
					}, {
						text: 'The first page',
						command: 'command one',
						output: ['existing command output 1', 'existing command output 2']
					}],
					current: {
						...defaultState.pages.current,
						text: 'The second page',
						command: 'command two',
						output: [],
						commandStatus: UNSTARTED
					},
					next: [{text: 'The third page', command: 'command three'}]
				}
			});
		});

		describe('when completing the first command', () => {
			it('completes the current command and sets the next current command', () => {
				const nextState = reducer({
					...defaultState,
					pages: {
						...defaultState.pages,
						current: {
							...defaultState.pages.current,
							commandStatus: FINISHED,
							output: ['existing command output 1', 'existing command output 2']
						}
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					pages: {
						...defaultState.pages,
						completed: [{
							text: 'The first page',
							command: 'command one',
							output: ['existing command output 1', 'existing command output 2']
						}],
						current: {
							...defaultState.pages.current,
							text: 'The second page',
							command: 'command two',
							output: [],
							commandStatus: UNSTARTED
						},
						next: [{text: 'The third page', command: 'command three'}]
					}
				});
			});
		});

		describe('when completing the last command', () => {
			it('completes the current command and sets the current command to undefined', () => {
				const nextState = reducer({
					...defaultState,
					pages: {
						...defaultState.pages,
						current: {
							...defaultState.pages.current,
							commandStatus: FINISHED,
							output: ['existing command output 1', 'existing command output 2']
						},
						next: []
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					pages: {
						...defaultState.pages,
						completed: [{
							text: 'The first page',
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
					cloudFoundryContext: {
						here: {
							is: {
								some: 'context'
							}
						}
					},
					pages: {
						...defaultState.pages,
						next: [{text: 'This page\'s command needs rendering', command: 'this command needs {{here.is.some}} to be rendered'}]
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					cloudFoundryContext: {
						here: {
							is: {
								some: 'context'
							}
						}
					},
					pages: {
						completed: [{
							text: 'The first page',
							command: 'command one',
							output: []}],
						current: {
							text: 'This page\'s command needs rendering',
							command: 'this command needs context to be rendered',
							commandStatus: 'UNSTARTED',
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
				cloudFoundryContext: {this: {is: {a: {cf: {context: 'update'}}}}}
			});
		});

		describe('when cf context exists already', () => {
			it('merges the cf context update', () => {
				const nextState = reducer({
					...defaultState,
					cloudFoundryContext: {test: {numbers: {1: 'one', 3: 'three'}}}
				}, updateCfContext({test: {numbers: {2: 'two'}}}));

				expect(nextState).toStrictEqual({
					...defaultState,
					cloudFoundryContext: {test: {numbers: {1: 'one', 2: 'two', 3: 'three'}}}
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
