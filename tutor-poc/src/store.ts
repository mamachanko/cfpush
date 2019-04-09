import {configureStore, Store} from 'redux-starter-kit';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer, State, initialState as defaultInitialState} from './reducer';
import {Action} from './actions'; // eslint-disable-line import/named

export const createStore = (initialState: State = defaultInitialState): Store<State, Action> =>
	configureStore<State, Action>({
		reducer,
		preloadedState: initialState,
		middleware: [
			commandRuntime(),
			loggingMiddleware
		]
	});
