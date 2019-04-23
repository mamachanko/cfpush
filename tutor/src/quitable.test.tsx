import {Box, Text} from 'ink';
import {render} from 'ink-testing-library';
import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux';
import {Quitable} from './quitable';
import {CTRL_C, createStoreMock} from './test-utils';
import {exitApp} from './actions';

const renderQuitable = (store: Store): any => {
	const exitDisplay = (
		<Box flexDirection="column">
			<Text>ok.</Text>
			<Text>bye.</Text>
		</Box>
	);

	const errorDisplay = (
		<Box flexDirection="column">
			<Text>really.</Text>
			<Text>sorry.</Text>
		</Box>
	);

	const {lastFrame, stdin} = render(
		<Provider store={store}>
			<Quitable exitDisplay={exitDisplay} errorDisplay={errorDisplay}>
				<Text>test child 1</Text>
				<Text>test child 2</Text>
			</Quitable>
		</Provider>
	);

	return {lastFrame, stdin};
};

describe('<Quitable>', () => {
	let store;
	let lastFrame;
	let stdin;

	describe('when not yet exiting', () => {
		beforeEach(() => {
			store = createStoreMock({app: {exit: false}});

			({lastFrame, stdin} = renderQuitable(store));
		});

		it('renders children', () => {
			expect(lastFrame()).toMatch(/test child 1\s*test child 2/);
		});

		describe('when pressing "ctrl-c"', () => {
			beforeEach(() => {
				stdin.write(CTRL_C);
			});

			it('schedules exit', () => {
				expect(store.dispatch).toHaveBeenCalledWith(exitApp());
				expect(store.dispatch).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('when exiting', () => {
		describe('when there is no error', () => {
			beforeEach(() => {
				store = createStoreMock({app: {exit: true}});

				({lastFrame} = renderQuitable(store));
			});

			it('shows exit display', () => {
				expect(lastFrame()).toMatch(/ok\.\s*bye\./);
			});
		});

		describe('when there is an error', () => {
			beforeEach(() => {
				const store = createStoreMock({
					app: {
						exit: true
					},
					pages: {
						current: {
							command: {
								error: true
							}
						}
					}
				});

				({lastFrame} = renderQuitable(store));
			});

			it('shows error display', () => {
				expect(lastFrame()).toMatch(/really\.\s*sorry\./);
			});
		});
	});
});
