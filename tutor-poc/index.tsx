import {render} from 'ink';
import * as React from 'react';
import {App, AppProps} from './app'; // eslint-disable-line import/named

const command = process.argv.slice(2).join(' ');

const props: AppProps = {
	ci: process.env.CI === 'true',
	dry: process.env.DRY === 'true',
	...(command ? {command} : {})
};

render(<App {...props}/>);
