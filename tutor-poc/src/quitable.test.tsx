import {Box, Text} from 'ink';
import {render} from 'ink-testing-library';
import * as React from 'react';
import {Provider} from 'react-redux';
import {Quitable} from './quitable';
import {CTRL_C, createStoreMock} from './test-utils';
import {exitApp} from './actions';
import {initialState} from './reducer';

const renderQuitable = (exit: boolean): any => {
	const store = createStoreMock({...initialState, app: {...initialState.app, exit}});

	const exitDisplay = (
		<Box flexDirection="column">
			<Text>ok.</Text>
			<Text>bye.</Text>
		</Box>
	);

	const {lastFrame, stdin} = render(
		<Provider store={store}>
			<Quitable exitDisplay={exitDisplay}>
				<Text>test child 1</Text>
				<Text>test child 2</Text>
			</Quitable>
		</Provider>
	);

	return {store, lastFrame, stdin};
};

describe('<Quitable>', () => {
	let store;
	let lastFrame;
	let stdin;

	describe('when not yet exiting', () => {
		beforeEach(() => {
			({store, lastFrame, stdin} = renderQuitable(false));
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
		beforeEach(() => {
			({store, lastFrame, stdin} = renderQuitable(true));
		});

		it('shows exit display', () => {
			expect(lastFrame()).toMatch(/ok\.\s*bye\./);
		});
	});
});
