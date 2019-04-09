import * as React from 'react';
import {Text} from 'ink';
import {Column} from './column';
import {ENTER, InputHandler, Key, useStdin, isAlnumOrSpace} from './input'; // eslint-disable-line import/named

const inputReducer = (input: string, newInput: string): string => input + newInput;

export const InputPrompt = ({submitInput}): React.ReactElement => {
	const [input, appendInput] = React.useReducer(inputReducer, '');

	const handleInput: InputHandler = (ch: string, key: Key): void => {
		if (key.name === ENTER) {
			submitInput(input);
			return;
		}

		if (isAlnumOrSpace(key)) {
			appendInput(ch);
		}
	};

	useStdin(handleInput);

	return (
		<Column>
			<Text>⚠️  input required</Text>
			<Text>{'>_ ' + input}</Text>
		</Column>
	);
};
