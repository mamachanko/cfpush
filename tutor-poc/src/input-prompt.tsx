import {Text} from 'ink';
import * as React from 'react';
import {Key, useOnAlnum, useOnEnter} from './input';

const KEYPRESS = 'KEYPRESS';
type Keypress = {
	type: typeof KEYPRESS;
	payload: {
		key: Key;
	};
}

const CLEAR = 'CLEAR';
type Clear = {
	type: typeof CLEAR;
}

type InputAction =
	| Keypress
	| Clear;

const inputReducer = (state: string, action: InputAction): string => {
	switch (action.type) {
		case (KEYPRESS): {
			return `${state}${action.payload.key.sequence}`;
		}

		case (CLEAR): {
			return '';
		}

		default:
			throw new Error(`unexpected action ${JSON.stringify(action)}`);
	}
};

type Props = {
	prompt: string;
	submit: (input: string) => void;
};

export const InputPrompt: React.FC<Props> = ({submit, prompt}): React.ReactElement => {
	const [input, dispatch] = React.useReducer(inputReducer, '');

	const keypress = (key: Key): void => dispatch({type: 'KEYPRESS', payload: {key}});
	const clear = (): void => dispatch({type: 'CLEAR'});

	useOnAlnum(keypress);
	useOnEnter(() => {
		clear();
		submit(input);
	});

	return <Text>{`${prompt} ` + input}</Text>;
};
