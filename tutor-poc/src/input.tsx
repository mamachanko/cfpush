import * as deepEqual from 'deep-equal';
import {StdinContext, Text} from 'ink';
import * as React from 'react';
import {Column} from './column';
import {logger} from './logging';

interface Key {
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

type CharacterKeyHandler = (ch: string, key: Key) => void;
type KeyHandler = (key: Key) => void;

const omitCharacter = (handleKey: KeyHandler): CharacterKeyHandler => (_: string, key: Key) => handleKey(key);

const logKeypress: KeyHandler = (key: Key): void => {
	logger.debug(`keypress: key=${JSON.stringify(key)}`);
};

const defaultKeyHandlers = [logKeypress];

const useStdin = (handleKey: KeyHandler): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	const listeners = React.useMemo(() => [...defaultKeyHandlers, handleKey].map(omitCharacter), [handleKey]);

	const subscribe = React.useCallback(() => {
		setRawMode(true);
		listeners.forEach(listener => stdin.on('keypress', listener));
	}, [setRawMode, listeners, stdin]);

	const unsubscribe = React.useCallback(() => {
		listeners.forEach(listener => stdin.removeListener('keypress', listener));
		setRawMode(false);
	}, [listeners, setRawMode, stdin]);

	React.useLayoutEffect(() => {
		subscribe();
		return unsubscribe;
	}, [subscribe, unsubscribe]);
};

export const useOnKey = (key: Key, callback: () => void): void => {
	useStdin((pressed: Key) => {
		if (deepEqual(pressed, key)) {
			callback();
		}
	});
};

export const useOnCtrlC = (callback: () => void): void => useOnKey(CTRL_C, callback);
export const useOnSpace = (callback: () => void): void => useOnKey(SPACE, callback);
export const useOnEnter = (callback: () => void): void => useOnKey(ENTER, callback);

const inputReducer = (input: string, newInput: string): string => input + newInput;

type Props = {
	submit: (input: string) => void;
}

export const InputPrompt: React.FC<Props> = ({submit}): React.ReactElement => {
	const [input, appendInput] = React.useReducer(inputReducer, '');

	const handleKey: KeyHandler = (key: Key): void => {
		if (isAlnumOrSpace(key)) {
			appendInput(key.sequence);
		}
	};

	useStdin(handleKey);

	useOnEnter(() => submit(input));

	return (
		<Column>
			<Text>⚠️  input required</Text>
			<Text>{'>_ ' + input}</Text>
		</Column>
	);
};

const isAlnumOrSpace = (key: Key): boolean =>
	key.name &&
	!key.ctrl &&
	Boolean(key.name.match(/[a-zA-Z0-9 ]+/));
