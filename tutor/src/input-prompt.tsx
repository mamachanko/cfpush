import {Box, Text} from 'ink';
import * as React from 'react';
import {Key, useOnAlnum, useOnBackspace, useOnEnter, useCursor} from './input';

const KEYPRESS = 'KEYPRESS';
type Keypress = {
	type: typeof KEYPRESS;
	payload: {
		key: Key;
	};
}

const REMOVE_LAST = 'REMOVE_LAST';
type RemoveLast = {
	type: typeof REMOVE_LAST;
}

const CLEAR = 'CLEAR';
type Clear = {
	type: typeof CLEAR;
}

type InputAction =
	| Keypress
	| RemoveLast
	| Clear;

const inputReducer = (state: string, action: InputAction): string => {
	switch (action.type) {
		case (KEYPRESS): {
			return `${state}${action.payload.key.sequence}`;
		}

		case (REMOVE_LAST): {
			return state.slice(0, state.length - 1);
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
	const cursor = useCursor();

	const keypress = (key: Key): void => dispatch({type: KEYPRESS, payload: {key}});
	const removeLast = (): void => dispatch({type: REMOVE_LAST});
	const clear = (): void => dispatch({type: CLEAR});

	useOnAlnum(keypress);
	useOnBackspace(removeLast);
	useOnEnter(() => {
		clear();
		submit(input);
	});

	return (
		<Box>
			<Text>{`${prompt} ${input}${cursor}`}</Text>
		</Box>
	);
};
