import * as deepmerge from 'deepmerge';
import * as Mustache from 'mustache';
import {Reducer} from 'redux';
import {Action, COMPLETED, EXIT_APP, FINISHED, INPUT_RECEIVED, INPUT_REQUIRED, OUTPUT_RECEIVED, STARTED, UPDATE_CF_CONTEXT} from './actions'; // eslint-disable-line import/named
import {State, UNSTARTED, RUNNING} from './state'; // eslint-disable-line import/named

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
			command: {
				command: 'date',
				status: UNSTARTED,
				stdout: []
			}
		},
		next: [{
			text: '',
			command: {command: 'date'}
		}]
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
						command: {
							...state.pages.current.command,
							status: RUNNING
						}
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
						command: {
							...state.pages.current.command,
							status: INPUT_REQUIRED
						}
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
						command: {
							...state.pages.current.command,
							status: FINISHED
						}
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
						command: {
							...state.pages.current.command,
							stdout: state.pages.current.command.stdout ?
								[...state.pages.current.command.stdout, action.payload] :
								[action.payload]
						}
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
						...state.pages.current,
						command: {
							command: state.pages.current.command.command,
							stdout: state.pages.current.command.stdout
						}
					}],
					current: state.pages.next[0] ? {
						text: state.pages.next[0].text,
						command: {
							command: Mustache.render(state.pages.next[0].command.command, state.cloudFoundryContext),
							status: UNSTARTED,
							stdout: []
						}
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
