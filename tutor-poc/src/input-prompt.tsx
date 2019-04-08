import {Text} from 'ink';
import * as React from 'react';
import {Column} from './column';
import {ENTER, InputHandler, Key, useStdin} from './use-stdin'; // eslint-disable-line import/named
import {logger} from './logging';

const r = (state, action) => String(state) + String(action);

export const InputPrompt = ({submitInput}): React.ReactElement => {
	const [state, dispatch] = React.useReducer(r, '');

	const handleInput: InputHandler = (ch: string, key: Key): void => {
		if (key.name === ENTER) {
			submitInput(state);
		}

		if (key.ctrl) {
			logger.debug(`nope. this ${key} is NOT for me.`);
		} else {
			logger.debug(`apparently, this ${key} is for me.`);
			dispatch(ch);
		}
	};

	useStdin(handleInput);

	return (
		<Column>
			<Text>⚠️  input required</Text>
			<Text>{'>_ ' + state}</Text>
		</Column>
	);
};
