const ci = process.env.CI === 'true';
const dry = process.env.DRY === 'true';

const tutorial = [
	'cf login -a api.run.pivotal.io --sso',
	'cf create-space cfpush-tutorial',
	'cf target -s cfpush-tutorial',
	'cf push chat-app -p ../builds/chat-app.zip -b staticfile_buildpack --random-route',
	// UpdateChatAppUrlAndHostname
	'cf app chat-app',
	'cf scale chat-app -m 64M -k 128M -f',
	'cf push message-service -p builds/message-service.jar --random-route',
	// UpdateMessageServiceUrl
	'cf routes',
	'cf map-route message-service cfapps.io --hostname ${CHAT_APP_HOSTNAME} --path /api',
	'cf scale message-service -i 3',
	'cf marketplace',
	'cf marketplace -s elephantsql',
	'cf create-service elephantsql turtle database',
	// Wait for service to be created
	'cf bind-service message-service database',
	'cf restart message-service',
	// Smoke tests
	'cf logs --recent message-service', // | grep GET | grep '\[APP\/PROC\/WEB\/\d\+\]'',
	'cf delete-space cfpush-tutorial -f',
	'cf logout'
];

export {ci, dry, tutorial};
