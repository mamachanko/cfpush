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

	describe('when given an env and a list of commands', () => {
		describe('when in Tutorial mode', () => {
			it('parses config', () => {
				expect(
					config.parseConfig([
						{title: 'Welcome', subtitle: 'welcome indeed', text: 'welcome. welcome. welcome.'},
						{text: 'let us login', command: {filename: 'cf', args: ['login']}},
						{text: 'let us deploy', command: {filename: 'cf', args: ['push']}}
					], {})
				).toStrictEqual({
					pages: [
						{title: 'Welcome', subtitle: 'welcome indeed', text: 'welcome. welcome. welcome.'},
						{text: 'let us login', command: {filename: 'cf', args: ['login']}},
						{text: 'let us deploy', command: {filename: 'cf', args: ['push']}}
					],
					mode: config.Tutorial
				}
				);
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
				expect(
					config.parseConfig([
						{title: 'Welcome', subtitle: 'welcome indeed', text: 'welcome. welcome. welcome.'},
						{text: 'let us login', command: {filename: 'cf', args: ['login']}},
						{text: 'let us deploy', command: {filename: 'cf', args: ['push']}}
					], {CI: 'true'})
				).toStrictEqual({
					pages: [
						{title: 'Welcome', subtitle: 'welcome indeed', text: 'welcome. welcome. welcome.'},
						{text: 'let us login', command: {filename: 'cf', args: ['login', '-a', 'api.run.pivotal.io', '-u', 'cf-user', '-p', 'cf-password', '-o', 'cf-org', '-s', 'cf-space']}},
						{text: 'let us deploy', command: {filename: 'cf', args: ['push']}}
					],
					mode: config.Ci
				}
				);
			});
		});

		describe('when in Dry mode', () => {
			it('parses config', () => {
				expect(
					config.parseConfig([
						{title: 'Welcome', subtitle: 'welcome indeed', text: 'welcome. welcome. welcome.'},
						{text: 'let us login', command: {filename: 'cf', args: ['login']}},
						{text: 'let us deploy', command: {filename: 'cf', args: ['push']}}
					], {DRY: 'true'})
				).toStrictEqual({
					pages: [
						{title: 'Welcome', subtitle: 'welcome indeed', text: 'welcome. welcome. welcome.'},
						{text: 'let us login', command: {filename: 'cf', args: ['login']}},
						{text: 'let us deploy', command: {filename: 'cf', args: ['push']}}
					],
					mode: config.Dry
				}
				);
			});
		});
	});
});
