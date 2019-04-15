import {render} from 'ink';
import {createApp} from './src/app';
import {parseConfig} from './src/config';

const pages = [
	{text: '', command: 'cf login -a api.run.pivotal.io --sso'},
	{text: '', command: 'cf create-space cfpush-tutorial'},
	{text: '', command: 'cf target -s cfpush-tutorial'},
	{text: '', command: 'cf push chat-app -p ../builds/chat-app.zip -b staticfile_buildpack --random-route'},
	{text: '', command: 'cf app chat-app'},
	{text: '', command: 'cf scale chat-app -m 64M -k 128M -f'},
	{text: '', command: 'cf push message-service -p ../builds/message-service.jar --random-route'},
	{text: '', command: 'cf routes'},
	{text: '', command: 'cf map-route message-service cfapps.io --hostname {{chat-app.hostname}} --path /api'},
	{text: '', command: 'cf scale message-service -i 3'},
	{text: '', command: 'cf marketplace'},
	{text: '', command: 'cf marketplace -s elephantsql'},
	{text: '', command: 'cf create-service elephantsql turtle database'},
	{text: '', command: 'cf bind-service message-service database'},
	{text: '', command: 'cf restart message-service'},
	// Smoke test
	{text: '', command: 'cf logs --recent message-service'}, // | grep GET | grep '\[APP\/PROC\/WEB\/\d\+\]''
	{text: '', command: 'cf delete-space cfpush-tutorial -f'},
	{text: '', command: 'cf logout'}
];

const config = parseConfig(pages, process.env);

const {waitUntilExit} = render(
	createApp(config),
	{exitOnCtrlC: false}
);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => console.log('🙅🏽‍♀️', error));
