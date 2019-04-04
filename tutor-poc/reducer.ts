import {Reducer} from 'redux';
import {Action, RUN_COMMAND, INPUT_REQUIRED, INPUT_RECEIVED, OUTPUT_RECEIVED, FINISHED} from './actions'; // eslint-disable-line import/named

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
	switch (action.type) {
		case (RUN_COMMAND): {
			return {
				...state,
				status: 'RUNNING',
				output: []
			};
		}

		case (INPUT_REQUIRED): {
			return {
				...state,
				status: 'INPUT_REQUIRED'
			};
		}

		case (INPUT_RECEIVED): {
			return {
				...state,
				status: 'RUNNING'
			};
		}

		case (FINISHED): {
			return {
				...state,
				status: 'FINISHED'
			};
		}

		case (OUTPUT_RECEIVED): {
			return {
				...state,
				output: state.output ? [...state.output, action.output] : [action.output]
			};
		}

		default: return state;
	}
};
