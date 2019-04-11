import * as deepEqual from 'deep-equal';
import {StdinContext} from 'ink';
import * as React from 'react';
import * as jsesc from 'jsesc';
import {logger} from './logging';

export interface Key {
	name: string;
	sequence: string;
	ctrl: boolean;
	shift: boolean;
	meta: boolean;
}

const defaultKey: Key = {
	name: '',
	sequence: '',
	ctrl: false,
	shift: false,
	meta: false
};

const SPACE: Key = {
	...defaultKey,
	name: 'space',
	sequence: ' '
};

const ENTER: Key = {
	...defaultKey,
	name: 'return',
	sequence: '\r'
};

const CTRL_C: Key = {
	...defaultKey,
	name: 'c',
	ctrl: true,
	sequence: '\u0003'
};

const BACKSPACE: Key = {
	...defaultKey,
	name: 'backspace',
	ctrl: false,
	sequence: '\u007F'
};

type CharacterKeyHandler = (ch: string, key: Key) => void;
type KeyHandler = (key: Key) => void;

const omitCharacter = (handleKey: KeyHandler): CharacterKeyHandler => (_: string, key: Key) => handleKey(key);

const logKeypress: CharacterKeyHandler = (character: string, key: Key): void => {
	logger.debug(`keypress: character="${character}", key=${JSON.stringify({...key, escapedSequence: jsesc(key.sequence)})}`);
};

const useStdin = (handleKey: KeyHandler): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);
	const listener = React.useMemo(() => omitCharacter(handleKey), [handleKey]);

	const subscribe = React.useCallback(() => {
		setRawMode(true);
		stdin.on('keypress', listener);
		if (!stdin.listeners('keypress').includes(logKeypress)) {
			stdin.prependListener('keypress', logKeypress);
		}
	}, [setRawMode, stdin, listener]);

	const unsubscribe = React.useCallback(() => {
		stdin.removeListener('keypress', listener);
		stdin.removeListener('keypress', logKeypress);
		setRawMode(false);
	}, [listener, setRawMode, stdin]);

	React.useLayoutEffect(() => {
		subscribe();
		return unsubscribe;
	}, [subscribe, unsubscribe]);
};

const useOnKey = (key: Key, callback: () => void): void => {
	useStdin((pressed: Key) => {
		if (deepEqual(pressed, key)) {
			callback();
		}
	});
};

export const useOnCtrlC = (callback: () => void): void => useOnKey(CTRL_C, callback);
export const useOnSpace = (callback: () => void): void => useOnKey(SPACE, callback);
export const useOnEnter = (callback: () => void): void => useOnKey(ENTER, callback);
export const useOnBackspace = (callback: () => void): void => useOnKey(BACKSPACE, callback);

const isAlnum = (key: Key): boolean => key.name && !key.ctrl && Boolean(key.sequence.match(/[a-zA-Z0-9]+/));

export const useOnAlnum = (keyHandler: KeyHandler): void => useStdin((key: Key) => {
	if (isAlnum(key)) {
		keyHandler(key);
	}
});
