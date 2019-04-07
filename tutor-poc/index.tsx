import {render} from 'ink';
import * as React from 'react';
import {App} from './src/app';

const {waitUntilExit} = render(<App/>);

waitUntilExit()
	.then(() => console.log('🏁'))
	.catch(error => console.log('🙅🏽‍♀️', error));
