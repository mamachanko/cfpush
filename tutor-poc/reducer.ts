import {Reducer} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named

export type CommandStatus =
	| 'UNSTARTED'
	| 'RUNNING'
	| 'INPUT_REQUIRED'
	| 'FINISHED';

export interface State {
	ci: boolean;
	dry: boolean;
	status: CommandStatus;
	output: string[];
}

export const initialState: State = {
	ci: false,
	dry: false,
	status: 'UNSTARTED',
	output: []
};

export const reducer: Reducer = (state: State = initialState, action: Action): State => {
	if (action.type === 'RUN_COMMAND') {
		return {
			...state,
			status: 'RUNNING',
			output: []
		};
	}

	if (action.type === 'INPUT_REQUIRED') {
		return {
			...state,
			status: 'INPUT_REQUIRED'
		};
	}

	if (action.type === 'INPUT_RECEIVED') {
		return {
			...state,
			status: 'RUNNING'
		};
	}

	if (action.type === 'FINISHED') {
		return {
			...state,
			status: 'FINISHED'
		};
	}

	if (action.type === 'OUTPUT_RECEIVED') {
		return {
			...state,
			output: state.output ? [...state.output, action.output] : [action.output]
		};
	}

	return state;
};
