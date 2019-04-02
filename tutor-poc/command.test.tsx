/* eslint-disable max-nested-callbacks */

import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import {Command, CommandProps} from './command'; // eslint-disable-line import/named

describe('<Command/>', () => {
	const ENTER = '\r';
	const SPACE = ' ';
	const defaultProps: CommandProps = {
		running: false,
		finished: false,
		inputRequired: false,
		command: 'test command',
		waitForTrigger: true,
		run: () => {},
		submitInput: () => {},
		output: []
	};

	afterEach(() => {
		cleanup();
	});

	describe('when command has not been run yet', () => {
		it('shows which command can be run', () => {
			const {lastFrame} = render(<Command {...defaultProps}/>);

			expect(lastFrame()).toMatch(/^press <space> to run "test command"$/i);
		});

		it('runs command on <space>', () => {
			const run = jest.fn();
			const {stdin} = render(<Command {...defaultProps} run={run}/>);

			expect(run).toHaveBeenCalledTimes(0);

			stdin.write(SPACE);

			expect(run).toHaveBeenCalledTimes(1);
		});

		describe('when not waiting for trigger', () => {
			it('runs command right away', () => {
				const run = jest.fn();

				render(<Command {...defaultProps} waitForTrigger={false} run={run}/>);

				expect(run).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('when command is running', () => {
		it('shows a spinner', () => {
			const {lastFrame} = render(<Command {...defaultProps} running/>);

			expect(lastFrame()).toMatch(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏] running$/i);
		});

		describe('when there is output', () => {
			it('shows output', () => {
				const {lastFrame} = render(<Command {...defaultProps} running output={['test command output 1', 'test command output 2']}/>);

				expect(lastFrame()).toMatch(/^test command output 1\ntest command output 2/i);
			});
		});

		describe('when there is no output', () => {
			it('shows no output', () => {
				const {lastFrame} = render(<Command {...defaultProps} running output={[]}/>);

				expect(lastFrame()).toMatch(/^no command output/i);
			});
		});

		describe('when input is required', () => {
			it('shows input is required', () => {
				const {lastFrame} = render(<Command {...defaultProps} running inputRequired/>);

				expect(lastFrame()).toMatch(/⚠️ input required/i);
				expect(lastFrame()).not.toMatch(/running/i);
			});

			it('shows input prompt', () => {
				const {lastFrame} = render(<Command {...defaultProps} running inputRequired/>);

				expect(lastFrame()).toMatch(/>_$/i);
			});

			describe('when user provides input', () => {
				it('shows user input', () => {
					const {lastFrame, stdin} = render(<Command {...defaultProps} running inputRequired/>);

					stdin.write('test user input');

					expect(lastFrame()).toMatch(/>_ test user input$/i);
				});

				describe('when user submits input', () => {
					it('submits input on <enter>', () => {
						const submitInput = jest.fn();
						const {stdin} = render(<Command {...defaultProps} running inputRequired submitInput={submitInput}/>);

						stdin.write('test user input');
						stdin.write(ENTER);

						expect(submitInput).toHaveBeenCalledWith('test user input');
						expect(submitInput).toHaveBeenCalledTimes(1);
					});
				});
			});
		});
	});

	describe('when the command has finished', () => {
		it('shows it has finished', () => {
			const {lastFrame} = render(<Command {...defaultProps} finished/>);

			expect(lastFrame()).toMatch(/✅ finished$/i);
		});

		it('shows output', () => {
			const {lastFrame} = render(<Command {...defaultProps} finished output={['test output 1', 'test output 2']}/>);

			expect(lastFrame()).toMatch(/test output 1\s*test output 2\s*✅ finished$/i);
		});
	});
});
