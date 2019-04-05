import {reducer, State} from './reducer';
import {runCommand, inputRequired, finished, outputReceived, INPUT_REQUIRED, inputReceived, completed} from './actions';
import {UNSTARTED, RUNNING, FINISHED} from './command-status';

const defaultState: State = {
	ci: false,
	dry: false,
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
			const nextState = reducer(defaultState, runCommand());

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
			const nextState = reducer(defaultState, outputReceived('new command output'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: ['new command output']
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
						output: ['existing command output']
					}
				}
			}, outputReceived('new command output'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: ['existing command output', 'new command output']
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
			}, outputReceived('new command output'));

			expect(nextState).toStrictEqual({
				...defaultState,
				commands: {
					...defaultState.commands,
					current: {
						...defaultState.commands.current,
						output: ['new command output']
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
			const nextState = reducer(defaultState, finished());

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
	});
});
