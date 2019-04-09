import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import stripAnsi from 'strip-ansi';
import {App} from './app';
import {UNSTARTED} from './command-status';
import {State} from './reducer';
import {createStore} from './store';

const SPACE = ' ';

const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

describe('<Command />', () => {
	const initialState: State = {
		ci: false,
		dry: false,
		exit: false,
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
			const {lastFrame, stdin} = render(
				<App store={createStore(initialState)}/>
			);

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hi this is the first command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');

			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hi this is the first command');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello this is the second command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');

			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hello this is the second command');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toMatch(
				/^\s*hi this is the first command\s*hello this is the second command\s*$/
			);
		});

		it('quits on "q"', async () => {
			const {lastFrame, stdin} = render(
				<App store={createStore(initialState)}/>
			);

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hi this is the first command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');

			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hi this is the first command');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write('q');
			await sleep(10);
			expect(stripAnsi(lastFrame())).toMatch(
				/^\s*hi this is the first command\s*ok.\s*bye.\s*$/
			);
		});
	});

	describe('when in dry mode', () => {
		it('pretends to run commands on <space>', async () => {
			const {lastFrame, stdin} = render(
				<App store={createStore({...initialState, dry: true})}/>
			);

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hi this is the first command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('pretending to run "echo hi this is the first command"');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello this is the second command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('pretending to run "echo hello this is the second command"');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toMatch(
				/^\s*pretending to run "echo hi this is the first command"\s*pretending to run "echo hello this is the second command"\s*$/
			);
		});
	});

	describe('when in ci mode', () => {
		it('runs commands one after another without prompt', async () => {
			const {lastFrame} = render(
				<App store={createStore({...initialState, ci: true})}/>
			);

			await sleep(50);

			expect(stripAnsi(lastFrame())).toMatch(
				/^\s*hi this is the first command\s*hello this is the second command\s*$/
			);
		});
	});
});
