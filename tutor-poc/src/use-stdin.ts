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
	logger.debug(`keypress: ch='${ch}', key=`, key);
};

export const useStdin = (handleInput: InputHandler): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	React.useLayoutEffect(() => {
		logger.info('--- usestdin: setting up ---');

		logger.debug('setRawMode(true)');
		setRawMode(true);

		logger.debug(`subscribing to keypress: ${handleInput}`);
		stdin.on('keypress', handleInput);

		logger.debug(`subscribing to keypress: ${logKeypress}`);
		stdin.on('keypress', logKeypress);

		logger.debug(`keypress listener count after subscribing: ${stdin.listenerCount('keypress')}`);

		logger.info('--- usestdin: set up ---');

		return () => {
			logger.info('--- usestdin: tearing down ---');

			logger.debug(`unsubscribing from keypress: ${handleInput}`);
			stdin.removeListener('keypress', handleInput);

			logger.debug(`unsubscribing from keypress: ${logKeypress}`);
			stdin.removeListener('keypress', logKeypress);

			logger.debug(`keypress listener count after unsubscribing: ${stdin.listenerCount('keypress')}`);

			logger.debug('setRawMode(false)');
			setRawMode(false);

			logger.info('--- usestdin: torn down ---');
		};
	}, [setRawMode, stdin, handleInput]);
};
