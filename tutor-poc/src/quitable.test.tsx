import {Box, Text} from 'ink';
import {render} from 'ink-testing-library';
import * as React from 'react';
import {Quitable} from './quitable';

describe('<Quitable>', () => {
	let lastFrame;
	let stdin;

	beforeEach(() => {
		const exitDisplay = (
			<Box flexDirection="column">
				<Text>ok.</Text>
				<Text>bye.</Text>
			</Box>
		);

		({lastFrame, stdin} = render(
			<Quitable exitDisplay={exitDisplay}>
				<Text>test child 1</Text>
				<Text>test child 2</Text>
			</Quitable>
		));
	});

	it('renders children', () => {
		expect(lastFrame()).toMatch(/test child 1\s*test child 2/);
	});

	describe('when pressing "q"', () => {
		beforeEach(() => {
			stdin.write('q');
		});

		it('shows exit display', () => {
			expect(lastFrame()).toMatch(/ok\.\s*bye\./);
		});
	});
});
