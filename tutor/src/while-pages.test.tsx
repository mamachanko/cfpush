import {Text} from 'ink';
import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import {Provider} from 'react-redux';
import {createStoreMock} from './test-utils';
import {WhilePages} from './while-pages';
import {UNSTARTED} from './state';

describe('<WhilePages>', () => {
	afterEach(() => {
		cleanup();
	});

	describe('when there is a current page', () => {
		const store = createStoreMock({
			pages: {
				current: {
					text: 'Let us run a test command',
					command: {
						filename: 'test',
						args: ['command'],
						status: UNSTARTED,
						stdout: []
					}
				}
			}
		});

		it('renders children', () => {
			const {lastFrame} = render(
				<Provider store={store}>
					<WhilePages>
						<Text>test child 1</Text>
						<Text>test child 2</Text>
					</WhilePages>
				</Provider>
			);

			expect(lastFrame()).toMatch(/test child 1\s*test child 2/);
		});
	});
	describe('when there is no more current page', () => {
		const store = createStoreMock({
			pages: {
				completed: [],
				current: null,
				next: []
			}
		});

		it('renders nothing', () => {
			const {lastFrame} = render(
				<Provider store={store}>
					<WhilePages>
						<Text>test child 1</Text>
						<Text>test child 2</Text>
					</WhilePages>
				</Provider>
			);

			expect(lastFrame()).toEqual('');
		});
	});
});
