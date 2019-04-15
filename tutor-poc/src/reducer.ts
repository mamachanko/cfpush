import * as deepmerge from 'deepmerge';
import * as Mustache from 'mustache';
import {Reducer} from 'redux';
import {Action, COMPLETED, EXIT_APP, FINISHED, INPUT_RECEIVED, INPUT_REQUIRED, OUTPUT_RECEIVED, STARTED, UPDATE_CF_CONTEXT} from './actions'; // eslint-disable-line import/named
import {State, UNSTARTED, RUNNING} from './state';

export const initialState: State = {
	app: {
		waitForTrigger: true,
		exit: false
	},
	cloudFoundryContext: {},
	pages: {
		completed: [],
		current: {
			text: '',
			command: 'date',
			commandStatus: UNSTARTED,
			output: []
		},
		next: [{text: '', command: 'date'}]
	}
};

export const reducer: Reducer = (state: State = initialState, action: Action): State => {
	switch (action.type) {
		case (INPUT_RECEIVED):
		case (STARTED): {
			return {
				...state,
				pages: {
					...state.pages,
					current: {
						...state.pages.current,
						commandStatus: RUNNING
					}
				}
			};
		}

		case (INPUT_REQUIRED): {
			return {
				...state,
				pages: {
					...state.pages,
					current: {
						...state.pages.current,
						commandStatus: INPUT_REQUIRED
					}
				}
			};
		}

		case (FINISHED): {
			return {
				...state,
				pages: {
					...state.pages,
					current: {
						...state.pages.current,
						commandStatus: FINISHED
					}
				}
			};
		}

		case (OUTPUT_RECEIVED): {
			return {
				...state,
				pages: {
					...state.pages,
					current: {
						...state.pages.current,
						output: state.pages.current.output ?
							[...state.pages.current.output, action.payload] :
							[action.payload]
					}
				}
			};
		}

		case (COMPLETED): {
			return {
				...state,
				pages: {
					...state.pages,
					completed: [...state.pages.completed, {
						text: state.pages.current.text,
						command: state.pages.current.command,
						output: state.pages.current.output
					}],
					current: state.pages.next[0] ? {
						text: state.pages.next[0].text,
						command: Mustache.render(state.pages.next[0].command, state.cloudFoundryContext),
						commandStatus: UNSTARTED,
						output: []
					} : undefined,
					next: state.pages.next.slice(1)
				}
			};
		}

		case (UPDATE_CF_CONTEXT): {
			return {
				...state,
				cloudFoundryContext: deepmerge(state.cloudFoundryContext, action.payload)
			};
		}

		case (EXIT_APP): {
			return {
				...state,
				app: {
					...state.app,
					exit: true
				}
			};
		}

		default: return state;
	}
};
