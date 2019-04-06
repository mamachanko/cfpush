import {Middleware} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named
import {log} from './logging';

const logAction = (action: Action): void => log(JSON.stringify(action));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loggingMiddleware: Middleware = _ => next => action => {
	logAction(action);
	next(action);
};
