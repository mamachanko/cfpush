import {Reducer} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named

export interface State {
	waitForTrigger: boolean;
	fakeCommands: boolean;
	running: boolean;
	finished: boolean;
	inputRequired: boolean;
	exitCode: number;
	output: string[];
}

export const initialState = {
	waitForTrigger: process.env.CI !== 'true',
	fakeCommands: process.env.DRY === 'true',
	// Idea: state = UNSTARTED | STARTED | FINISHED
	running: false,
	finished: false,
	inputRequired: false,
	exitCode: -1,
	output: []
};

export const reducer: Reducer = (state: State = initialState, action: Action): State => {
	if (action.type === 'RUN_COMMAND') {
		return {
			...state,
			running: true,
			finished: false,
			inputRequired: false,
			exitCode: -1,
			output: []
		};
	}

	if (action.type === 'OUTPUT_RECEIVED') {
		return {
			...state,
			output: [...state.output, action.output]
		};
	}

	if (action.type === 'INPUT_REQUIRED') {
		return {
			...state,
			inputRequired: true
		};
	}

	if (action.type === 'INPUT_RECEIVED') {
		return {
			...state,
			inputRequired: false
		};
	}

	if (action.type === 'FINISHED') {
		return {
			...state,
			running: false,
			finished: true,
			inputRequired: false,
			exitCode: action.exitCode
		};
	}

	return state;
};
