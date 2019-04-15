import {cleanup, render} from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import {createApp} from './app';
import {Ci, Dry, Tutorial} from './config';
import {CTRL_C, sleep, SPACE} from './test-utils';

describe('<App />', () => {
	const pages = [
		{text: '', command: 'echo hi this is the first command'},
		{text: '', command: 'echo hello this is the second command'}
	];

	afterEach(() => {
		cleanup();
	});

	describe('when in tutorial mode', () => {
		it('runs commands one after another by pressing <space>', async () => {
			const {lastFrame, stdin} = render(createApp({pages, mode: Tutorial}));

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

		it('quits on "ctrl-c"', async () => {
			const {lastFrame, stdin} = render(createApp({pages, mode: Tutorial}));

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hi this is the first command"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');

			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hi this is the first command');
			expect(stripAnsi(lastFrame())).toContain('done. press <space> to complete.');

			stdin.write(CTRL_C);
			await sleep(10);
			expect(stripAnsi(lastFrame())).toMatch(
				/^\s*hi this is the first command\s*oh, i am slain/i
			);
		});
	});

	describe('when in dry mode', () => {
		it('pretends to run commands on <space>', async () => {
			const {lastFrame, stdin} = render(createApp({pages, mode: Dry}));

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
			const {lastFrame} = render(createApp({pages, mode: Ci}));

			await sleep(50);

			expect(stripAnsi(lastFrame())).toMatch(
				/^\s*hi this is the first command\s*hello this is the second command\s*$/
			);
		});
	});
});
