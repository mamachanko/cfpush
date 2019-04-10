import * as React from 'react';
import {Text} from 'ink';
import {Column} from './column';
import {Key, useOnAlnum, useOnEnter} from './input';

const inputReducer = (input: string, key: Key): string => `${input}${key.sequence}`;

type Props = {
	submit: (input: string) => void;
};

export const InputPrompt: React.FC<Props> = ({submit}): React.ReactElement => {
	const [input, appendKey] = React.useReducer(inputReducer, '');

	useOnAlnum(appendKey);
	useOnEnter(() => submit(input));

	return (
		<Column>
			<Text>⚠️  input required</Text>
			<Text>{'>_ ' + input}</Text>
		</Column>
	);
};
