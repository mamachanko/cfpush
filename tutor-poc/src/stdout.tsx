import {Box, Color, Text} from 'ink';
import * as React from 'react';
import * as stripFinalNewline from 'strip-final-newline';
import {Column} from './column';
import * as state from './state';

const mapToLast = <T extends {}>(array: T[], f: (t: T) => T): T[] => array.map((x: any, i: number) => (array.length === i + 1) ? f(x) : x);

const trimOutput = (output: state.Output): state.Output => ({...output, text: stripFinalNewline(output.text)});

const Output = (output: state.Output): React.ReactElement => (
	<Box key={output.uid} marginLeft={2}>
		<Text>
			{output.text}
		</Text>
	</Box>
);

const NoOutput = (): React.ReactElement => (
	<Box marginLeft={2}>
		<Text>
			<Color grey>
				no command output yet
			</Color>
		</Text>
	</Box>
);

type StdoutProps = {
	readonly stdout: state.Stdout;
}

export const Stdout: React.FC<StdoutProps> = ({stdout}): React.ReactElement => {
	const width = 60;
	const dividerTop = `┌${new Array(width).fill('─').join('')} output ─┐`;
	const dividerBottom = `└${new Array(dividerTop.length - 2).fill('─').join('')}┘`;
	return (
		<Column>
			{dividerTop}
			{'⇣' + ('⇣'.padStart(dividerTop.length - 1, ' '))}

			{(stdout && stdout.length > 0) ? mapToLast(stdout, trimOutput).map(Output) : <NoOutput/>}

			{' '}
			{dividerBottom}
		</Column>
	);
};
