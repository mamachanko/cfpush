import * as fs from 'fs';

const LOG_FILENAME = '/tmp/app.log';

export const log = (message: string, logFilename: string = LOG_FILENAME): void => {
	fs.appendFile(logFilename, `${message}/n`, () => { });
};
