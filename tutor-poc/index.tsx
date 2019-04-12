import {render} from 'ink';
import {createApp} from './src/app';
import {config} from './src/config';

const {waitUntilExit} = render(
	createApp(config),
	{exitOnCtrlC: false}
);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => console.log('🙅🏽‍♀️', error));
