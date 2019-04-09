import {render, RenderOptions} from 'ink';
import * as React from 'react';
import {App} from './src/app';

const options: RenderOptions = {
	exitOnCtrlC: false
};

const {waitUntilExit} = render(<App/>, options);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => console.log('🙅🏽‍♀️', error));
