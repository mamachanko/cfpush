import * as deepmerge from 'deepmerge';
import * as Mustache from 'mustache';
import {Reducer} from 'redux';
import {Action, COMPLETED, EXIT_APP, FINISHED, INPUT_RECEIVED, INPUT_REQUIRED, OUTPUT_RECEIVED, STARTED, UPDATE_CF_CONTEXT} from './actions'; // eslint-disable-line import/named
import * as CommandStatus from './command-status';
import {State} from './state';

export const initialState: State = {
	app: {
		waitForTrigger: true,
		exit: false
	},
	cloudFoundryContext: {},
	commands: {
		completed: [],
		current: {
			command: 'date',
			status: 'UNSTARTED',
			output: []
		},
		next: ['date']
	}
};

export const reducer: Reducer = (state: State = initialState, action: Action): State => {
	switch (action.type) {
		case (INPUT_RECEIVED):
		case (STARTED): {
			return {
				...state,
				commands: {
					...state.commands,
					current: {
						...state.commands.current,
						status: CommandStatus.RUNNING
					}
				}
			};
		}

		case (INPUT_REQUIRED): {
			return {
				...state,
				commands: {
					...state.commands,
					current: {
						...state.commands.current,
						status: CommandStatus.INPUT_REQUIRED
					}
				}
			};
		}

		case (FINISHED): {
			return {
				...state,
				commands: {
					...state.commands,
					current: {
						...state.commands.current,
						status: CommandStatus.FINISHED
					}
				}
			};
		}

		case (OUTPUT_RECEIVED): {
			return {
				...state,
				commands: {
					...state.commands,
					current: {
						...state.commands.current,
						output: state.commands.current.output ?
							[...state.commands.current.output, action.payload] :
							[action.payload]
					}
				}
			};
		}

		case (COMPLETED): {
			return {
				...state,
				commands: {
					...state.commands,
					completed: [...state.commands.completed, {
						command: state.commands.current.command,
						output: state.commands.current.output
					}],
					current: state.commands.next[0] ? {
						command: Mustache.render(state.commands.next[0], state.cloudFoundryContext),
						status: CommandStatus.UNSTARTED,
						output: []
					} : undefined,
					next: state.commands.next.slice(1)
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
