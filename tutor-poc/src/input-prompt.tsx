import * as React from 'react';
import {Text} from 'ink';
import {ENTER, InputHandler, Key, useStdin, isAlnumOrSpace} from './input'; // eslint-disable-line import/named
import {Column} from './column';

const inputReducer = (input: string, newInput: string): string => input + newInput;

type Props = {
	submit: (input: string) => void;
}

export const InputPrompt: React.FC<Props> = ({submit}): React.ReactElement => {
	const [input, appendInput] = React.useReducer(inputReducer, '');

	const handleInput: InputHandler = (ch: string, key: Key): void => {
		if (key.name === ENTER) {
			submit(input);
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
