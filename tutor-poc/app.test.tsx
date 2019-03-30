import {cleanup, render} from 'ink-testing-library';
import * as React from 'react';
import stripAnsi from 'strip-ansi';
import {App} from './app';

const SPACE = ' ';

const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

describe('<Command />', () => {
	afterEach(() => {
		cleanup();
	});

	it('runs command when pressing space', async () => {
		const {lastFrame, stdin} = render(
			<App command="echo hello there"/>
		);

		expect(stripAnsi(lastFrame())).toContain('press <space> to run "echo hello there"');

		await sleep(10);
		stdin.write(SPACE);
		expect(stripAnsi(lastFrame())).toContain('running');

		await sleep(10);
		expect(stripAnsi(lastFrame())).toContain('hello there');
		expect(stripAnsi(lastFrame())).not.toContain('running');

		await sleep(10);
		stdin.write(SPACE);
		expect(stripAnsi(lastFrame())).toContain('running');

		await sleep(10);
		expect(stripAnsi(lastFrame())).toContain('hello there');
		expect(stripAnsi(lastFrame())).not.toContain('running');
	});
});
