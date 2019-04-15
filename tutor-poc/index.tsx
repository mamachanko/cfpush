import {render} from 'ink';
import {createApp} from './src/app';
import {parseConfig} from './src/config';
import tutorial from './tutorial';

const config = parseConfig(tutorial, process.env);

const {waitUntilExit} = render(
	createApp(config),
	{exitOnCtrlC: false}
);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => console.log('🙅🏽‍♀️', error));
