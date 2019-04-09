import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import {InputPrompt} from './input-prompt';

describe('<InputPrompt/>', () => {
	let lastFrame;
	let stdin;

	const submit = jest.fn();

	afterEach(() => {
		jest.resetAllMocks();
		cleanup();
	});

	beforeEach(() => {
		({lastFrame, stdin} = render(<InputPrompt submitInput={submit}/>));
	});

	it('shows prompt', () => {
		expect(lastFrame()).toMatch(/input required\s*>_/);
	});

	describe('when typing', () => {
		beforeEach(() => {
			stdin.write('h');
			stdin.write('e');
			stdin.write('ll');
			stdin.write('o');
			stdin.write(' ');
			stdin.write('123');
		});

		it('shows input', () => {
			expect(lastFrame()).toMatch(/input required\s*>_ hello 123/);
		});

		describe('when pressing <enter>', () => {
			beforeEach(() => {
				stdin.write('\r');
			});

			it('submits input', () => {
				expect(submit).toHaveBeenCalledWith('hello 123');
				expect(submit).toHaveBeenCalledTimes(1);
			});

			it('clears input', () => {
				expect(lastFrame()).toMatch(/input required\s*>_/);
			});
		});
	});
});
