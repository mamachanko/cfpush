import {render} from 'ink';
import * as React from 'react';
import {App} from './app';

const command = process.argv.slice(2).join(' ');

render(<App {...(command ? {command} : {})}/>);
