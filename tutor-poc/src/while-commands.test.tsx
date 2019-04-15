import {Text} from 'ink';
import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import {Provider} from 'react-redux';
import {createStoreMock} from './test-utils';
import {WhileCommands} from './while-commands';

describe('<WhileCommands>', () => {
	afterEach(() => {
		cleanup();
	});

	describe('when there is a current command', () => {
		const store = createStoreMock({
			pages: {
				completed: [],
				current: {
					text: 'Let us run a test command',
					command: 'test command',
					status: 'UNSTARTED',
					output: []
				},
				next: []
			}
		});

		it('renders children', () => {
			const {lastFrame} = render(
				<Provider store={store}>
					<WhileCommands>
						<Text>test child 1</Text>
						<Text>test child 2</Text>
					</WhileCommands>
				</Provider>
			);

			expect(lastFrame()).toMatch(/test child 1\s*test child 2/);
		});
	});
	describe('when there is no more current command', () => {
		const store = createStoreMock({
			pages: {
				completed: [],
				current: undefined,
				next: []
			}
		});

		it('renders nothing', () => {
			const {lastFrame} = render(
				<Provider store={store}>
					<WhileCommands>
						<Text>test child 1</Text>
						<Text>test child 2</Text>
					</WhileCommands>
				</Provider>
			);

			expect(lastFrame()).toEqual('');
		});
	});
});
