import {Middleware} from 'redux';
import {logger} from './logging';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loggingMiddleware: Middleware = store => next => action => {
	logger.info(`state: ${JSON.stringify(store.getState())}`);
	logger.info(`action: ${JSON.stringify(action)}`);
	next(action);
};
