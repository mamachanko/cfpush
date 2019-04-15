import {Static, Text} from 'ink';
import * as React from 'react';
import * as stripFinalNewline from 'strip-final-newline';
import {Column} from './column';
import * as state from './state';

const mapToLast = <T extends {}>(array: T[], f: (t: T) => T): T[] => array.map((x: any, i: number) => (array.length === i + 1) ? f(x) : x);

const trimOutput = (output: state.Output): state.Output => ({text: stripFinalNewline(output.text), uid: output.uid});

const OutputLine = (output: state.Output): React.ReactElement => (
	<Text key={output.uid}>
		{output.text}
	</Text>
);

export const Output = ({output}): React.ReactElement => {
	if (output && output.length > 0) {
		return (
			<Column>
				<Static>
					{mapToLast(output, trimOutput).map(OutputLine)}
				</Static>
			</Column>
		);
	}

	return <Text>no command output</Text>;
};
