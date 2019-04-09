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
		({lastFrame, stdin} = render(<InputPrompt submit={submit}/>));
	});

	it('shows prompt', () => {
		expect(lastFrame()).toMatch(/input required\s*>_/);
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

		it('shows alphanumeric and whitespace input only', () => {
			expect(lastFrame()).toMatch(/input required\s*>_ hEllO 123/);
		});

		describe('when pressing <enter>', () => {
			beforeEach(() => {
				stdin.write('\r');
			});

			it('submits input', () => {
				expect(submit).toHaveBeenCalledWith('hEllO 123');
				expect(submit).toHaveBeenCalledTimes(1);
			});

			it('clears input', () => {
				expect(lastFrame()).toMatch(/input required\s*>_/);
			});
		});
	});
});
