import {configureStore, Store} from 'redux-starter-kit';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';
import {logger} from './logging';

export const createStore = (initialState: any): Store => {
	logger.debug('initial state:', initialState);

	return configureStore({
		reducer,
		preloadedState: initialState,
		middleware: [
			commandRuntime(),
			loggingMiddleware
		]
	});
};
