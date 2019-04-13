import * as config from './config';

describe('Config', () => {
	describe('when given an env', () => {
		it('parses mode', () => {
			expect(config.parseMode({})).toBe(config.Tutorial);
			expect(config.parseMode({CI: 'true'})).toBe(config.Ci);
			expect(config.parseMode({DRY: 'true'})).toBe(config.Dry);
			expect(config.parseMode({CI: 'true', DRY: 'true'})).toBe(config.Ci);
		});
	});

	describe('when given a list of commands', () => {
		describe('when in Tutorial mode', () => {
			it('returns commands', () => {
				expect(config.parseCommands([], config.Tutorial)).toEqual([]);
				expect(config.parseCommands(['cf login', 'cf push'], config.Tutorial)).toEqual(['cf login', 'cf push']);
			});
		});

		describe('when in Ci mode', () => {
			beforeEach(() => {
				process.env.CF_USERNAME = 'cf-user';
				process.env.CF_PASSWORD = 'cf-password';
				process.env.CF_ORG = 'cf-org';
				process.env.CF_SPACE = 'cf-space';
			});

			afterEach(() => {
				delete process.env.CF_USERNAME;
				delete process.env.CF_PASSWORD;
				delete process.env.CF_ORG;
				delete process.env.CF_SPACE;
			});

			it('replaces any "cf login" with a non-interactive "cf login" by taking credentials from the environment', () => {
				expect(config.parseCommands([], config.Ci)).toEqual([]);
				expect(config.parseCommands(['cf login', 'cf push'], config.Ci)).toEqual(['cf login -a api.run.pivotal.io -u cf-user -p cf-password -o cf-org -s cf-space', 'cf push']);
			});
		});
	});

	describe('when given an env and a list of commands', () => {
		describe('when in Tutorial mode', () => {
			it('parses config', () => {
				expect(config.parseConfig(['cf login', 'cf push'], {})).toEqual({commands: ['cf login', 'cf push'], mode: config.Tutorial});
			});
		});

		describe('when in Ci mode', () => {
			beforeEach(() => {
				process.env.CF_USERNAME = 'cf-user';
				process.env.CF_PASSWORD = 'cf-password';
				process.env.CF_ORG = 'cf-org';
				process.env.CF_SPACE = 'cf-space';
			});

			afterEach(() => {
				delete process.env.CF_USERNAME;
				delete process.env.CF_PASSWORD;
				delete process.env.CF_ORG;
				delete process.env.CF_SPACE;
			});

			it('parses config and turns any "cf login" non-interactive', () => {
				expect(config.parseConfig(['cf login', 'cf push'], {CI: 'true'})).toEqual({commands: ['cf login -a api.run.pivotal.io -u cf-user -p cf-password -o cf-org -s cf-space', 'cf push'], mode: config.Ci});
			});
		});

		describe('when in Dry mode', () => {
			it('parses config', () => {
				expect(config.parseConfig(['cf login', 'cf push'], {DRY: 'true'})).toEqual({commands: ['cf login', 'cf push'], mode: config.Dry});
			});
		});
	});
});
