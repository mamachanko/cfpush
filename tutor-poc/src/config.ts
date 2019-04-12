import {logger} from './logging';

export const Tutorial = 'TUTORIAL';
export const Dry = 'DRY';
export const Ci = 'CI';
export type Mode =
	| typeof Tutorial
	| typeof Dry
	| typeof Ci;

export interface Config {
	mode: Mode;
	commands: ReadonlyArray<string>;
}

const getMode = (): Mode => {
	const ci = process.env.CI === 'true';
	const dry = process.env.DRY === 'true';

	switch (`${ci} ${dry}`) {
		case ('true false'):
		case ('true true'):
			logger.debug('CI IT IS');
			return Ci;
		case ('false true'):
			logger.debug('DRY IT IS');
			return Dry;
		default:
			logger.debug('TUTORIAL IT IS');
			return Tutorial;
	}
};

const commands = [
	'cf login -a api.run.pivotal.io --sso',
	// 'cf create-space cfpush-tutorial',
	// 'cf target -s cfpush-tutorial',
	// 'cf push chat-app -p ../builds/chat-app.zip -b staticfile_buildpack --random-route',
	// // UpdateChatAppUrlAndHostname
	// 'cf app chat-app',
	// 'cf scale chat-app -m 64M -k 128M -f',
	// 'cf push message-service -p builds/message-service.jar --random-route',
	// // UpdateMessageServiceUrl
	// 'cf routes',
	// 'cf map-route message-service cfapps.io --hostname ${CHAT_APP_HOSTNAME} --path /api',
	// 'cf scale message-service -i 3',
	// 'cf marketplace',
	// 'cf marketplace -s elephantsql',
	// 'cf create-service elephantsql turtle database',
	// // Wait for service to be created
	// 'cf bind-service message-service database',
	// 'cf restart message-service',
	// // Smoke tests
	// 'cf logs --recent message-service', // | grep GET | grep '\[APP\/PROC\/WEB\/\d\+\]'',
	// 'cf delete-space cfpush-tutorial -f',
	'cf logout'
];

export const config: Config = {
	mode: getMode(),
	commands
};
