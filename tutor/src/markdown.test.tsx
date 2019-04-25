import {render} from 'ink-testing-library';
import * as React from 'react';
import {Box} from 'ink';
import {Markdown} from './markdown';

describe('renderMarkdown()', () => {
	it.only('renders markdown', () => {
		const markdown = 'This is the **title** page. It _welcomes_ you. It _really_ means it. Here is a [link](https://cfpush.cloud). Have **plenty of fun**! This is a strong **title** too.';

		const {lastFrame} = render(<Markdown markdown={markdown}/>);

		expect(lastFrame()).toEqual(`
            This is the \u001B[1mtitle\u001B[22m page. It \u001B[3mwelcomes\u001B[23m you. It \u001B[3mreally\u001B[23m means it. Here is a \u001B]8;;https://cfpush.cloud\u0007link\u001B]8;;\u0007. Have \u001B[1mplenty of fun\u001B[22m! This is a strong \u001B[1mtitle\u001B[22m too.
        `.trim());
	});

	// It.only('renders stuff', () => {
	// 	const markdown = `
	// 			The $(bold "chat-app") is served at $(underline {{CHAT_APP_URL}})
	// 			The $(bold "message-service") is served at  $(underline {{MESSAGE_SERVICE_URL}})

	// 			The $(bold "chat-app") expects to reach the $(bold "message-service") at $(underline {{CHAT_APP_URL}}/api).
	// 			Mind the path $(underline "/api"). That's the problem!

	// 			Cloud Foundry's path-based routing to the rescue.

	// 			Let's map the route $(underline {{CHAT_APP_URL}}/api) to the $(bold "message-service").
	// 		`.trim();

	// 	render(<Markdown markdown={markdown}/>);

	// 	// Expect(lastFrame()).toEqual(`
	// 	//     This is the \u001B[1mtitle\u001B[22m page. It \u001B[3mwelcomes\u001B[23m you. Here is a \u001B]8;;https://cfpush.cloud\u0007link\u001B]8;;\u0007. Have \u001B[1mplenty of fun\u001B[22m!
	// 	// `.trim());
	// });

	it('renders nothing', () => {
		const {lastFrame} = render(<Markdown markdown=""/>);

		expect(lastFrame()).toEqual('');
	});
});
