import * as deepmerge from 'deepmerge';
import {Reducer} from 'redux';
import {Action, COMPLETED, EXIT_APP, FINISHED, INPUT_RECEIVED, INPUT_REQUIRED, STARTED, STDOUT_RECEIVED, UPDATE_CF_CONTEXT} from './actions';
import {renderPage} from './page-utils';
import {CurrentCommand, Page, RUNNING, State} from './state';

export const reducer: Reducer = (state: State, action: Action): State => {
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
				...(action.error ? {app: {...state.app, exit: true}} : {}),
				pages: {
					...state.pages,
					current: {
						...state.pages.current,
						command: {
							...state.pages.current.command,
							...(action.error ? {error: true} : {}),
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
				const next = renderPage(state.pages.next[0], state.cloudFoundryContext);

				if (next.command) {
					current = next as Page<CurrentCommand>;
				} else {
					current = next as Page<null>;
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
