import {render} from 'ink-testing-library';
import * as React from 'react';
import {Markdown} from './markdown';

describe('renderMarkdown()', () => {
	it('renders markdown', () => {
		const markdown = `
            This is the **title** page. It _welcomes_ you. Here is a [link](https://cfpush.cloud). Have **plenty of fun**!
        `.trim();

		const {lastFrame} = render(<Markdown markdown={markdown}/>);

		expect(lastFrame()).toEqual(`
            This is the \u001B[1mtitle\u001B[22m page. It \u001B[3mwelcomes\u001B[23m you. Here is a \u001B]8;;https://cfpush.cloud\u0007link\u001B]8;;\u0007. Have \u001B[1mplenty of fun\u001B[22m!
        `.trim());
	});
});
