import {render} from 'ink';
import {createApp} from './src/app';
import {parse} from './src/config';
import tutorial from './tutorial';

const config = parse(tutorial, process.env);

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
