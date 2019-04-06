import {createLogger, format, transports} from 'winston';

const LOG_FILENAME = 'cfpush.log';

export const logger = createLogger({
	level: 'debug',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		format.errors({stack: true}),
		format.splat(),
		format.json(),
		format.colorize(),
		format.simple()
	),
	defaultMeta: {service: 'cfpush'},
	transports: [
		new transports.File({filename: LOG_FILENAME})
	]
});
