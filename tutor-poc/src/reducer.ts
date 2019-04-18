import * as deepmerge from 'deepmerge';
import {Reducer} from 'redux';
import {Action, COMPLETED, EXIT_APP, FINISHED, INPUT_RECEIVED, INPUT_REQUIRED, STDOUT_RECEIVED, STARTED, UPDATE_CF_CONTEXT} from './actions';
import {State, UNSTARTED, RUNNING, CurrentCommand, Page} from './state';
import {CommandUtils} from './command-utils';

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
				filename: 'date',
				args: [],
				status: UNSTARTED,
				stdout: []
			}
		},
		next: [{
			text: '',
			command: {filename: 'date', args: []}
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

		case (STDOUT_RECEIVED): {
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
			let current: Page<CurrentCommand>;
			if (state.pages.next[0]) {
				if (state.pages.next[0].command) {
					current = {
						...state.pages.next[0],
						command: {
							...CommandUtils.render(state.pages.next[0].command, state.cloudFoundryContext),
							status: UNSTARTED,
							stdout: []
						}
					};
				} else {
					current = (state.pages.next[0] as Page<null>);
				}
			} else {
				current = null;
			}

			return {
				...state,
				pages: {
					...state.pages,
					completed: [
						...state.pages.completed, {
							...state.pages.current,
							...(state.pages.current.command ? {command: {
								filename: state.pages.current.command.filename,
								args: state.pages.current.command.args,
								stdout: state.pages.current.command.stdout
							}} : {})
						}
					],
					current,
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
