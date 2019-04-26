import {render} from 'ink-testing-library';
import * as React from 'react';
import {Box, Text} from 'ink';
import {bold, italic, link, Markdown, parseMarkdown, plain} from './markdown';

const sampleMarkdown = 'This is the **welcome** page. It _welcomes_ you. It _really_ means it. Here is a [link](https://cfpush.cloud). Have **plenty of fun**! Did it say **welcome**?';

const ansiBold = (text: string): string => `\u001B[1m${text}\u001B[22m`;
const ansiItalic = (text: string): string => `\u001B[3m${text}\u001B[23m`;
const ansiLink = (name: string, url: string): string => `\u001B]8;;${url}\u0007${name}\u001B]8;;\u0007`;

describe('parseMarkdown', () => {
	it('parses markdown string', () => {
		expect(
			parseMarkdown(sampleMarkdown)
		).toStrictEqual([
			plain('This is the '),
			bold('welcome'),
			plain(' page. It '),
			italic('welcomes'),
			plain(' you. It '),
			italic('really'),
			plain(' means it. Here is a '),
			link('link', 'https://cfpush.cloud'),
			plain('. Have '),
			bold('plenty of fun'),
			plain('! Did it say '),
			bold('welcome'),
			plain('?')
		]);
	});
});

describe('<Markdown>', () => {
	it('renders markdown string', () => {
		const {lastFrame} = render(<Markdown markdown={sampleMarkdown}/>);

		expect(
			lastFrame()
		).toEqual(
			`This is the ${ansiBold('welcome')} page. It ${ansiItalic('welcomes')} you. It ${ansiItalic('really')} means it. Here is a ${ansiLink('link', 'https://cfpush.cloud')}. Have ${ansiBold('plenty of fun')}! Did it say ${ansiBold('welcome')}?`
		);
	});

	it('renders markdown multiline string', () => {
		const multilineMarkdown = `The **chat-app**.

A **message-service**. It expects **message-service** on _/api_.

The **chat-app**; a "_bundle_". At _./builds/chat-app.zip_.

Push _./builds/chat-app.zip_. Done.`;

		const {lastFrame} = render(<Markdown markdown={multilineMarkdown}/>);

		expect(lastFrame()).toEqual(
			`The ${ansiBold('chat-app')}.

A ${ansiBold('message-service')}. It expects ${ansiBold('message-service')} on ${ansiItalic('/api')}.

The ${ansiBold('chat-app')}; a "${ansiItalic('bundle')}". At ${ansiItalic('./builds/chat-app.zip')}.

Push ${ansiItalic('./builds/chat-app.zip')}. Done.`);
	});

	it('renders plain mutiline string', () => {
		const multilineMarkdown = `The chat-app.

A message-service. It expects message-service on /api.

The chat-app; a "bundle". At ./builds/chat-app.zip.

Push ./builds/chat-app.zip. Done.`;

		const {lastFrame} = render(<Markdown markdown={multilineMarkdown}/>);

		expect(lastFrame()).toEqual(
			`The chat-app.

A message-service. It expects message-service on /api.

The chat-app; a "bundle". At ./builds/chat-app.zip.

Push ./builds/chat-app.zip. Done.`);
	});

	it('renders empty string', () => {
		const {lastFrame} = render(<Markdown markdown=""/>);

		expect(lastFrame()).toEqual('');
	});
});

test('layout reference', () => {
	const {lastFrame} = render(
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text>Paragraph 1 has </Text><Text bold>bold</Text><Text>{'\ntext.'}</Text>
			</Box>
			<Box marginBottom={1}>
				<Text>Paragraph 2</Text>
			</Box>
			<Box>
				<Text>Paragraph 3</Text>
			</Box>
		</Box>
	);

	expect(lastFrame()).toEqual(`
Paragraph 1 has ${ansiBold('bold')}
text.

Paragraph 2

Paragraph 3
`.trim());
});
