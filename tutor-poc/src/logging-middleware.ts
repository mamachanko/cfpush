import {Middleware} from 'redux';
import {logger} from './logging';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loggingMiddleware: Middleware = _ => next => action => {
	logger.info(`action: ${JSON.stringify(action)}`);
	next(action);
};
