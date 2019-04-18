import {logger} from './logging';
import {Middleware} from './middleware';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loggingMiddleware: Middleware = _ => next => action => {
	logger.info(`action: ${JSON.stringify(action)}`);
	next(action);
};
