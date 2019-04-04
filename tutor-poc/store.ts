import {configureStore, Store} from 'redux-starter-kit';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';

export const createStore = (initialState: any): Store => configureStore({
	reducer,
	preloadedState: initialState,
	middleware: [
		commandRuntime(),
		loggingMiddleware
	]
});
