import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import {InputPrompt} from './input-prompt';
import {CTRL_C} from './test-utils';

describe('<InputPrompt/>', () => {
	let lastFrame;
	let stdin;

	const submit = jest.fn();

	afterEach(() => {
		jest.resetAllMocks();
		cleanup();
	});

	beforeEach(() => {
		({lastFrame, stdin} = render(<InputPrompt submit={submit} prompt={'input goes here >_'}/>));
	});

	it('shows prompt', () => {
		expect(lastFrame()).toEqual('input goes here >_');
	});

	describe('when typing', () => {
		beforeEach(() => {
			stdin.write('h');
			stdin.write('@');
			stdin.write('E');
			stdin.write('[$$]');
			stdin.write('ll');
			stdin.write('O');
			stdin.write(CTRL_C);
			stdin.write(' ');
			stdin.write('123');
		});

		it('shows alphanumeric input only', () => {
			expect(lastFrame()).toEqual('input goes here >_ hEllO123');
		});

		describe('when pressing <enter>', () => {
			beforeEach(() => {
				stdin.write('\r');
			});

			it('submits input', () => {
				expect(submit).toHaveBeenCalledWith('hEllO123');
				expect(submit).toHaveBeenCalledTimes(1);
			});

			it('clears input', () => {
				expect(lastFrame()).toEqual('input goes here >_');
			});
		});
	});
});
