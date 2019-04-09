import * as React from 'react';
import {Text} from 'ink';
import {Column} from './column';
import {ENTER, InputHandler, Key, useStdin} from './input'; // eslint-disable-line import/named

export const InputPrompt = ({submitInput}): React.ReactElement => {
	const [userInput, setUserInput] = React.useState('');

	const handleInput: InputHandler = (ch: string, key: Key): void => {
		if (key.name === ENTER) {
			submitInput(userInput);
		} else {
			setUserInput(prevUserInput => prevUserInput + ch);
		}
	};

	useStdin(handleInput);

	return (
		<Column>
			<Text>⚠️  input required</Text>
			<Text>{'>_ ' + userInput}</Text>
		</Column>
	);
};
