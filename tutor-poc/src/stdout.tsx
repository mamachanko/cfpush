import {Box, Color, Text, Static} from 'ink';
import * as React from 'react';
import * as stripFinalNewline from 'strip-final-newline';
import {Column} from './column';
import * as state from './state';

export const Stdout: React.FC<StdoutProps> = ({stdout, pin = false}): React.ReactElement => {
	const output = mapToLast(stdout, trimOutput).map(Output);

	if (pin) {
		return (
			<Static>
				{output}
			</Static>
		);
	}

	return (
		<Frame title="output">
			{output.length > 0 ? output : <NoOutput/>}
		</Frame>
	);
};

type StdoutProps = {
	readonly stdout: state.Stdout;
	readonly pin: boolean;
}

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

const Frame: React.FC<FrameProps> = ({children, title, width = 60, borderChar = '─'}): React.ReactElement => {
	const topInner = title.padStart(width - 2 - title.length, borderChar);
	const top = `┌${topInner}┐`;

	const bottomInner = new Array(top.length - 2).fill(borderChar).join('');
	const bottom = `└${bottomInner}┘`;

	return (
		<Column>
			{top}
			{' '}
			{children}
			{' '}
			{bottom}
		</Column>
	);
};

type FrameProps = {
	title: string;
	width?: number;
	borderChar?: string;
}
