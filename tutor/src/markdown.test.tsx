import {render} from 'ink-testing-library';
import * as React from 'react';
import {Markdown, parseMarkdown, plain, bold, italic, link} from './markdown';

const markdown = `
This is the **welcome** page.
It _welcomes_ you.
It _really_ means it.
Here is a [link](https://cfpush.cloud).
Have **plenty of fun**!
Did it say **welcome**?
`.trim().replace(/\r?\n|\r/g, ' ');

describe('parseMarkdown', () => {
	it('parses markdown', () => {
		expect(
			parseMarkdown(markdown)
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
	it('renders markdown', () => {
		const {lastFrame} = render(<Markdown markdown={markdown}/>);

		expect(
			lastFrame()
		).toEqual(
			'This is the \u001B[1mwelcome\u001B[22m page. It \u001B[3mwelcomes\u001B[23m you. It \u001B[3mreally\u001B[23m means it. Here is a \u001B]8;;https://cfpush.cloud\u0007link\u001B]8;;\u0007. Have \u001B[1mplenty of fun\u001B[22m! Did it say \u001B[1mwelcome\u001B[22m?'
		);
	});

	it('renders nothing', () => {
		const {lastFrame} = render(<Markdown markdown=""/>);

		expect(lastFrame()).toEqual('');
	});
});
