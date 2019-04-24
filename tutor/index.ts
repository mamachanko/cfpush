import {render} from 'ink';
import {createApp} from './src/app';
import {parse, Config} from './src/config';

const createConfig = (): Config => {
	const configFile = process.argv[2];

	if (!configFile) {
		console.log('config file missing');
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}

	return parse(configFile, process.env);
};

const config = createConfig();

console.clear();

const {waitUntilExit} = render(
	createApp(config),
	{exitOnCtrlC: false}
);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => {
		console.log('🙅🏽‍♀️', error);
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	});
