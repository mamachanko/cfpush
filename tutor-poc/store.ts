import {configureStore, Store} from 'redux-starter-kit';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';
import {log} from './logging';

export const createStore = (initialState: any): Store => {
	log(`\ninitial state: ${JSON.stringify(initialState)}`);

	return configureStore({
		reducer,
		preloadedState: initialState,
		middleware: [
			commandRuntime(),
			loggingMiddleware
		]
	});
};
