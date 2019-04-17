/* eslint-disable max-nested-callbacks */

import {completed, exitApp, finished, inputReceived, inputRequired, INPUT_REQUIRED, stdoutReceived, started, updateCfContext} from './actions';
import {reducer} from './reducer';
import {State, UNSTARTED, RUNNING, FINISHED} from './state'; // eslint-disable-line import/named

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
			command: {
				command: 'command one',
				status: UNSTARTED,
				stdout: []
			}
		},
		next: [
			{text: 'The second page', command: {command: 'command two'}},
			{text: 'The third page', command: {command: 'command three'}}
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
						command: {
							...defaultState.pages.current.command,
							status: RUNNING
						}
					}
				}
			});
		});
	});

	describe('when output is received', () => {
		it('appends to the current command\'s empty output', () => {
			const nextState = reducer(defaultState, stdoutReceived({text: 'new command output', uid: 'uid 123'}));

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						command: {
							...defaultState.pages.current.command,
							stdout: [{text: 'new command output', uid: 'uid 123'}]
						}
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
						command: {
							...defaultState.pages.current.command,
							stdout: [{text: 'existing command output', uid: 'uid 0'}]
						}
					}
				}
			}, stdoutReceived({text: 'new command output', uid: 'uid 1'}));

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						command: {
							...defaultState.pages.current.command,
							stdout: [
								{text: 'existing command output', uid: 'uid 0'},
								{text: 'new command output', uid: 'uid 1'}
							]
						}
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
						command: {
							...defaultState.pages.current.command,
							stdout: null
						}
					}
				}
			}, stdoutReceived({text: 'new command output', uid: 'uid 123'}));

			expect(nextState).toStrictEqual({
				...defaultState,
				pages: {
					...defaultState.pages,
					current: {
						...defaultState.pages.current,
						command: {
							...defaultState.pages.current.command,
							stdout: [{text: 'new command output', uid: 'uid 123'}]
						}
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
						command: {
							...defaultState.pages.current.command,
							status: INPUT_REQUIRED
						}
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
						command: {
							...defaultState.pages.current.command,
							status: RUNNING
						}
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
						command: {
							...defaultState.pages.current.command,
							status: FINISHED
						}
					}
				}
			});
		});
	});

	describe('when completing a page', () => {
		describe('when it has a command', () => {
			it('completes the current page and sets the next current page', () => {
				const nextState = reducer({
					...defaultState,
					pages: {
						...defaultState.pages,
						completed: [{
							text: 'The zeroth page',
							command: {
								command: 'command zero',
								stdout: [
									{text: 'existing command output 1', uid: 'abc'},
									{text: 'existing command output 2', uid: 'def'}
								]
							}
						}],
						current: {
							...defaultState.pages.current,
							command: {
								...defaultState.pages.current.command,
								status: FINISHED,
								stdout: [
									{text: 'existing command output 3', uid: 'xyz'},
									{text: 'existing command output 4', uid: 'urs'}
								]
							}
						}
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					pages: {
						...defaultState.pages,
						completed: [{
							text: 'The zeroth page',
							command: {
								command: 'command zero',
								stdout: [
									{text: 'existing command output 1', uid: 'abc'},
									{text: 'existing command output 2', uid: 'def'}
								]
							}
						}, {
							text: 'The first page',
							command: {
								command: 'command one',
								stdout: [
									{text: 'existing command output 3', uid: 'xyz'},
									{text: 'existing command output 4', uid: 'urs'}
								]
							}
						}],
						current: {
							...defaultState.pages.current,
							text: 'The second page',
							command: {
								...defaultState.pages.current.command,
								command: 'command two',
								stdout: [],
								status: UNSTARTED
							}
						},
						next: [{text: 'The third page', command: {command: 'command three'}}]
					}
				});
			});

			describe('when completing the first page', () => {
				it('completes the current command and sets the next current command', () => {
					const nextState = reducer({
						...defaultState,
						pages: {
							...defaultState.pages,
							current: {
								...defaultState.pages.current,
								command: {
									...defaultState.pages.current.command,
									status: FINISHED,
									stdout: [
										{text: 'existing command output 1', uid: 'abc'},
										{text: 'existing command output 2', uid: 'def'}
									]
								}
							}
						}
					}, completed());

					expect(nextState).toStrictEqual({
						...defaultState,
						pages: {
							...defaultState.pages,
							completed: [{
								text: 'The first page',
								command: {
									command: 'command one',
									stdout: [
										{text: 'existing command output 1', uid: 'abc'},
										{text: 'existing command output 2', uid: 'def'}
									]
								}
							}],
							current: {
								...defaultState.pages.current,
								text: 'The second page',
								command: {
									command: 'command two',
									stdout: [],
									status: UNSTARTED
								}
							},
							next: [{text: 'The third page', command: {command: 'command three'}}]
						}
					});
				});
			});

			describe('when completing the last page', () => {
				it('completes the current command and sets the current command to undefined', () => {
					const nextState = reducer({
						...defaultState,
						pages: {
							...defaultState.pages,
							current: {
								...defaultState.pages.current,
								command: {
									...defaultState.pages.current.command,
									status: FINISHED,
									stdout: [
										{command: 'existing command output 1', uid: 'abc'},
										{command: 'existing command output 2', uid: 'def'}
									]
								}
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
								command: {
									command: 'command one',
									stdout: [
										{command: 'existing command output 1', uid: 'abc'},
										{command: 'existing command output 2', uid: 'def'}
									]
								}
							}],
							current: null,
							next: []
						}
					});
				});
			});

			describe('when the next page\'s command contains a placeholder', () => {
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
							next: [{
								text: 'This page\'s command needs rendering',
								command: {command: 'this command needs {{here.is.some}} to be rendered'}
							}]
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
								command: {
									command: 'command one',
									stdout: []
								}
							}],
							current: {
								text: 'This page\'s command needs rendering',
								command: {
									command: 'this command needs context to be rendered',
									status: 'UNSTARTED',
									stdout: []
								}
							},
							next: []
						}
					});
				});
			});
		});

		describe('when it has no command', () => {
			it('completes the current page and sets the next current page', () => {
				const nextState = reducer({
					...defaultState,
					pages: {
						completed: [],
						current: {
							title: 'current title',
							text: 'current text'
						},
						next: [{
							title: 'next title',
							text: 'next text'
						}]
					}
				}, completed());

				expect(nextState).toStrictEqual({
					...defaultState,
					pages: {
						completed: [{
							title: 'current title',
							text: 'current text'
						}],
						current: {
							title: 'next title',
							text: 'next text'
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
