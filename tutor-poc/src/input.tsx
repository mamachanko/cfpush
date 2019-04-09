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

export type InputHandler = (character: string, key: Key) => void;

const logKeypress: InputHandler = (ch, key): void => {
	logger.debug(`keypress: ch='${ch}', key=${JSON.stringify(key)}`);
};

const useStdin = (handleInput: InputHandler): void => {
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

export const useOnKey = (key: Key, callback: () => void): void => {
	useStdin((_: string, pressed: Key) => {
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

	const handleInput: InputHandler = (ch: string, key: Key): void => {
		if (isAlnumOrSpace(key)) {
			appendInput(key.sequence);
		}
	};

	useStdin(handleInput);

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
