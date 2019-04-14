import {render} from 'ink';
import {createApp} from './src/app';
import {parseConfig} from './src/config';

const commands = [
	'cf login -a api.run.pivotal.io --sso',
	'cf create-space cfpush-tutorial',
	'cf target -s cfpush-tutorial',
	'cf push chat-app -p ../builds/chat-app.zip -b staticfile_buildpack --random-route',
	'cf app chat-app',
	'cf scale chat-app -m 64M -k 128M -f',
	'cf push message-service -p ../builds/message-service.jar --random-route',
	'cf routes',
	'cf map-route message-service cfapps.io --hostname {{chat-app.hostname}} --path /api',
	'cf scale message-service -i 3',
	'cf marketplace',
	'cf marketplace -s elephantsql',
	'cf create-service elephantsql turtle database',
	'cf bind-service message-service database',
	'cf restart message-service',
	// Smoke tests
	'cf logs --recent message-service', // | grep GET | grep '\[APP\/PROC\/WEB\/\d\+\]'',
	'cf delete-space cfpush-tutorial -f',
	'cf logout'
];

const config = parseConfig(commands, process.env);

const {waitUntilExit} = render(
	createApp(config),
	{exitOnCtrlC: false}
);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => console.log('🙅🏽‍♀️', error));
