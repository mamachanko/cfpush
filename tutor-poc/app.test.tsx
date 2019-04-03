import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import stripAnsi from 'strip-ansi';
import {App} from './app';
import {createStore} from './store';

const SPACE = ' ';

const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

describe('<Command />', () => {
	afterEach(() => {
		cleanup();
	});

	describe('when in tutorial mode', () => {
		it('runs command when pressing space', async () => {
			const {lastFrame, stdin} = render(
				<App command="echo hello there" store={createStore()}/>
			);

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello there"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('running');

			await sleep(10);
			expect(stripAnsi(lastFrame())).toContain('hello there');
			expect(stripAnsi(lastFrame())).not.toContain('running');
		});
	});

	describe('when in dry mode', () => {
		it('pretends to run command on <space>', async () => {
			const {lastFrame, stdin} = render(
				<App dry command="echo hello we are in dry mode" store={createStore()}/>
			);

			expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello we are in dry mode"');

			stdin.write(SPACE);
			expect(stripAnsi(lastFrame())).toContain('pretending to run "echo hello we are in dry mode"');
			expect(stripAnsi(lastFrame())).not.toContain('running');
		});
	});

	describe('when in ci mode', () => {
		it('runs command right away', async () => {
			const {lastFrame} = render(
				<App ci command="echo hello we are in ci mode" store={createStore()}/>
			);

			await sleep(100);
			expect(stripAnsi(lastFrame())).toContain('hello we are in ci mode');
			expect(stripAnsi(lastFrame())).not.toContain('running');
		});
	});
});
