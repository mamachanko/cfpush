import {configureStore, Store} from 'redux-starter-kit';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';

export const createStore = (): Store => configureStore({
	reducer,
	middleware: [
		commandRuntime(),
		loggingMiddleware
	]
});
