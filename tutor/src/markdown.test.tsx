import chalk from 'chalk';
import {Box} from 'ink';
import {render} from 'ink-testing-library';
import * as React from 'react';
import * as terminalLink from 'terminal-link';
import {bold, italic, link, Markdown, parse, plain} from './markdown';

const sampleMarkdown = 'This is the **welcome** page. It _welcomes_ you. It _really_ means it. Here is a [link](https://cfpush.cloud). Have **plenty of fun**! Did it say **welcome**?';

describe('parseMarkdown', () => {
	it('parses markdown string', () => {
		expect(
			parse(sampleMarkdown)
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
			`This is the ${chalk.bold('welcome')} page. It ${chalk.italic('welcomes')} you. It ${chalk.italic('really')} means it. Here is a ${terminalLink('link', 'https://cfpush.cloud')}. Have ${chalk.bold('plenty of fun')}! Did it say ${chalk.bold('welcome')}?`
		);
	});

	it('renders markdown multiline string', () => {
		const multilineMarkdown = `The **chat-app**.

A **message-service**. It expects **message-service** on _/api_.

The **chat-app**; a "_bundle_". At _./builds/chat-app.zip_.

Push _./builds/chat-app.zip_. Done.`;

		const {lastFrame} = render(<Markdown markdown={multilineMarkdown}/>);

		expect(lastFrame()).toEqual(
			`The ${chalk.bold('chat-app')}.

A ${chalk.bold('message-service')}. It expects ${chalk.bold('message-service')} on ${chalk.italic('/api')}.

The ${chalk.bold('chat-app')}; a "${chalk.italic('bundle')}". At ${chalk.italic('./builds/chat-app.zip')}.

Push ${chalk.italic('./builds/chat-app.zip')}. Done.`);
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
		<Box width={16} textWrap="wrap">
			{`Paragraph 1 has ${chalk.bold('bold')} text.

Paragraph 2

Paragraph 3`}
		</Box>
	);

	expect(lastFrame()).toEqual(`Paragraph 1 has
${chalk.bold('bold')} text.

Paragraph 2

Paragraph 3`);
});
