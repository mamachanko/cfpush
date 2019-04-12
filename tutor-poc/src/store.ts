import {configureStore, Store} from 'redux-starter-kit';
import {Action} from './actions'; // eslint-disable-line import/named
import {createCommandRuntimeMiddleware} from './command-runtime';
import {config, Ci, Dry} from './config';
import {loggingMiddleware} from './logging-middleware';
import {initialState as defaultInitialState, reducer, State} from './reducer';
import {createDryMiddleware} from './dry-middleware';
import {ciMiddleware} from './ci-middleware';

export const createStore = (initialState: State = defaultInitialState): Store<State, Action> =>
	configureStore<State, Action>({
		reducer,
		preloadedState: initialState,
		middleware: [
			...(config.mode === Ci ? [ciMiddleware] : []),
			...(config.mode === Dry ? [createDryMiddleware()] : [createCommandRuntimeMiddleware()]),
			loggingMiddleware
		]
	});
