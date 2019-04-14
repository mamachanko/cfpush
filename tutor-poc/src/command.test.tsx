/* eslint-disable max-nested-callbacks */

import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import {Command, CommandProps} from './command'; // eslint-disable-line import/named
import {RUNNING, INPUT_REQUIRED} from './command-status';
import {CurrentCommand} from './reducer';
import {FINISHED} from './actions';

describe('<Command/>', () => {
	const ENTER = '\r';
	const SPACE = ' ';
	const defaultProps: CommandProps = {
		currentCommand: {
			command: 'test command',
			status: 'UNSTARTED',
			output: []
		},
		waitForTrigger: true,
		run: () => {},
		complete: () => {},
		submit: () => {}
	};

	afterEach(() => {
		cleanup();
	});

	describe('when command has not yet been run', () => {
		it('shows which command can be run', () => {
			const {lastFrame} = render(<Command {...defaultProps}/>);

			expect(lastFrame()).toMatch(/press <space> to run "test command"/i);
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
			const runningCommand: CurrentCommand = {
				command: 'test command',
				status: RUNNING,
				output: []
			};
			const {lastFrame} = render(<Command {...defaultProps} currentCommand={runningCommand}/>);

			expect(lastFrame()).toMatch(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏] running/i);
		});

		describe('when there is output', () => {
			it('shows output', () => {
				const runningCommandWithOutput: CurrentCommand = {
					command: 'test command',
					status: RUNNING,
					output: [{text: 'test command output 1', uid: '1'}, {text: 'test command output 2', uid: '2'}]
				};
				const {lastFrame} = render(<Command {...defaultProps} currentCommand={runningCommandWithOutput}/>);

				expect(lastFrame()).toMatch(/test command output 1\ntest command output 2/i);
			});
		});

		describe('when there is no output', () => {
			it('shows no output', () => {
				const runningCommandWithoutOutput: CurrentCommand = {
					command: 'test command',
					status: RUNNING,
					output: []
				};
				const {lastFrame} = render(<Command {...defaultProps} currentCommand={runningCommandWithoutOutput}/>);

				expect(lastFrame()).toMatch(/no command output/i);
			});
		});

		describe('when input is required', () => {
			const commandWaitingForInput: CurrentCommand = {
				command: 'test command',
				status: INPUT_REQUIRED,
				output: []
			};

			it('shows input prompt', () => {
				const {lastFrame} = render(<Command {...defaultProps} currentCommand={commandWaitingForInput}/>);

				expect(lastFrame()).toMatch(/⚠️ {2}input required >_/i);
			});

			describe('when user provides input', () => {
				it('shows user input', () => {
					const {lastFrame, stdin} = render(<Command {...defaultProps} currentCommand={commandWaitingForInput}/>);

					stdin.write('test user input');

					expect(lastFrame()).toMatch(/>_ testuserinput/i);
				});

				describe('when user submits input', () => {
					it('submits input on <enter>', () => {
						const submit = jest.fn();
						const {stdin} = render(<Command {...defaultProps} currentCommand={commandWaitingForInput} submit={submit}/>);

						stdin.write('test user input');
						stdin.write(ENTER);

						expect(submit).toHaveBeenCalledWith('testuserinput');
						expect(submit).toHaveBeenCalledTimes(1);
					});
				});
			});
		});
	});

	describe('when the command has finished', () => {
		const finishedCommand: CurrentCommand = {
			command: 'test command',
			status: FINISHED,
			output: [{text: 'test output 1', uid: '1'}, {text: 'test output 2', uid: '2'}]
		};

		it('shows output', () => {
			const {lastFrame} = render(<Command {...defaultProps} currentCommand={finishedCommand}/>);

			expect(lastFrame()).toMatch(/test output 1\s*test output 2\s*/i);
		});

		it('shows it has finished', () => {
			const {lastFrame} = render(<Command {...defaultProps} currentCommand={finishedCommand}/>);

			expect(lastFrame()).toMatch(/✅ finished/i);
		});

		it('shows prompt to complete', () => {
			const {lastFrame} = render(<Command {...defaultProps} currentCommand={finishedCommand}/>);

			expect(lastFrame()).toMatch(/done. press <space> to complete./i);
		});

		describe('when pressing <space>', () => {
			it('completes the command', () => {
				const complete = jest.fn();
				const {stdin} = render(<Command {...defaultProps} currentCommand={finishedCommand} complete={complete}/>);

				stdin.write(SPACE);

				expect(complete).toHaveBeenCalledTimes(1);
			});
		});
	});
});
