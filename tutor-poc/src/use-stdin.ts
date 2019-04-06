import * as React from 'react';
import {StdinContext} from 'ink';
import {log} from './logging';

export const SPACE = 'space';
export const ENTER = 'return';

export interface Key {
	name: string;
}
export type InputHandler = (character: string, key: Key) => void;

const logKeypress: InputHandler = (ch, key): void => log(`keypress: ch='${ch}', key=${JSON.stringify(key)}`);

export const useStdin = (handleInput: InputHandler): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);
	React.useLayoutEffect(() => {
		setRawMode(true);
		stdin.on('keypress', handleInput);
		stdin.on('keypress', logKeypress);
		return () => {
			stdin.removeAllListeners('keypress');
			setRawMode(false);
		};
	}, [setRawMode, stdin, handleInput]);
};
