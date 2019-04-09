import * as React from 'react';
import {StdinContext} from 'ink';
import {logger} from './logging';

export const SPACE = 'space';
export const ENTER = 'return';

export interface Key {
	name: string;
	ctrl: boolean;
}
export type InputHandler = (character: string, key: Key) => void;

const logKeypress: InputHandler = (ch, key): void => {
	logger.debug(`keypress: ch='${ch}', key=${JSON.stringify(key)}`);
};

export const useStdin = (handleInput: InputHandler): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	React.useLayoutEffect(() => {
		setRawMode(true);
		stdin.on('keypress', handleInput);
		stdin.on('keypress', logKeypress);

		return () => {
			stdin.removeListener('keypress', handleInput);
			stdin.removeListener('keypress', logKeypress);
			setRawMode(false);
		};
	}, [setRawMode, stdin, handleInput]);
};
