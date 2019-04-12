import * as React from 'react';
import {render, cleanup} from 'ink-testing-library';
import {Text} from 'ink';
import {Provider} from 'react-redux';
import {WhileCommands} from './while-commands';
import {initialState} from './reducer';
import {createStoreMock} from './test-utils';

describe('<WhileCommands>', () => {
	afterEach(() => {
		cleanup();
	});

	describe('when there is a current command', () => {
		const store = createStoreMock({
			...initialState,
			commands: {
				completed: [],
				current: {
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
			...initialState,
			commands: {
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
