import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import stripAnsi from 'strip-ansi';
import {App} from './app';
import {createStore} from './store';
import {State} from './reducer';
import {UNSTARTED} from './command-status';
import {log} from './logging';

const SPACE = ' ';

const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

describe('<Command />', () => {
	const initialState: State = {
		ci: false,
		dry: false,
		commands: {
			completed: [],
			current: {
				command: 'echo hi this is the first command',
				status: UNSTARTED,
				output: []
			},
			next: ['echo hello this is the second command']
		}
	};

	afterEach(() => {
		cleanup();
	});

	describe('when in tutorial mode', () => {
		it('runs commands one after another by pressing <space>', async () => {
			const exit = jest.fn();
			const {lastFrame, stdin} = render(
				<App store={createStore(initialState)} exit={exit}/>
			);

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hi this is the first command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');
			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hi this is the first command');
			expect(stripAnsi(lastFrame())).not.toContain('running');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');
			expect(exit).not.toHaveBeenCalled();

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello this is the second command"');
			expect(exit).not.toHaveBeenCalled();

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');
			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hello this is the second command');
			expect(stripAnsi(lastFrame())).not.toContain('running');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(SPACE);
			expect(exit).toHaveBeenCalledTimes(1);
		});
	});

	describe('when in dry mode', () => {
		it('pretends to run commands on <space>', async () => {
			const exit = jest.fn();
			const {lastFrame, stdin} = render(
				<App store={createStore({...initialState, dry: true})} exit={exit}/>
			);

			log(lastFrame());
			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hi this is the first command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('pretending to run "echo hi this is the first command"');
			expect(stripAnsi(lastFrame())).not.toContain('running');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');
			expect(exit).not.toHaveBeenCalled();

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello this is the second command"');
			expect(exit).not.toHaveBeenCalled();

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('pretending to run "echo hello this is the second command"');
			expect(stripAnsi(lastFrame())).not.toContain('running');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(SPACE);
			log(lastFrame());
			expect(exit).toHaveBeenCalledTimes(1);
		});
	});

	describe('when in ci mode', () => {
		it('runs commands right away and exits', async () => {
			const exit = jest.fn();
			render(
				<App store={createStore({...initialState, ci: true})} exit={exit}/>
			);

			await sleep(10);
			expect(exit).toHaveBeenCalled();
		});
	});
});
