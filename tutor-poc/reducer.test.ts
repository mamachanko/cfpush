import {reducer, State} from './reducer';
import {runCommand, inputRequired, finished, outputReceived} from './actions';

const defaultState: State = {
	ci: false,
	dry: false,
	status: 'UNSTARTED',
	output: []
};

describe('reducer', () => {
	it('updates to status "RUNNING"', () => {
		const nextState = reducer(defaultState, runCommand(''));

		expect(nextState).toStrictEqual({
			...defaultState,
			status: 'RUNNING'
		});
	});

	it('updates to status "INPUT_REQUIRED"', () => {
		const nextState = reducer(defaultState, inputRequired());

		expect(nextState).toStrictEqual({
			...defaultState,
			status: 'INPUT_REQUIRED'
		});
	});

	it('updates to status "FINISHED"', () => {
		const nextState = reducer(defaultState, finished());

		expect(nextState).toStrictEqual({
			...defaultState,
			status: 'FINISHED'
		});
	});

	describe('when receiving output', () => {
		it('initialises output from undefined', () => {
			const nextState = reducer({...defaultState, output: undefined}, outputReceived('new output'));

			expect(nextState).toStrictEqual({
				...defaultState,
				output: ['new output']
			});
		});

		it('appends output to empty output', () => {
			const nextState = reducer(defaultState, outputReceived('new output'));

			expect(nextState).toStrictEqual({
				...defaultState,
				output: ['new output']
			});
		});

		it('appends output to existing output', () => {
			const nextState = reducer({...defaultState, output: ['existing output']}, outputReceived('new output'));

			expect(nextState).toStrictEqual({
				...defaultState,
				output: ['existing output', 'new output']
			});
		});
	});
});
