import * as fs from 'fs';
import {Middleware} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named

const logToFile = (action: Action): void =>
	fs.appendFile(
		'/tmp/app.log',
		JSON.stringify(action) + '\n',
		() => { }
	);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loggingMiddleware: Middleware = _ => next => action => {
	logToFile(action);
	next(action);
};
