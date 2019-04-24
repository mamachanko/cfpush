import * as path from 'path';
import * as config from './config';

describe('Config', () => {
	const configFile = path.resolve(__dirname, 'test-config.yaml');
	let env: any;

	describe('when given a list of pages', () => {
		describe('when in Tutorial mode', () => {
			beforeEach(() => {
				env = {};
			});

			it('parses into config', () => {
				expect(
					config.parse(configFile, env)
				).toStrictEqual({
					initialState: {
						app: {
							waitForTrigger: true,
							pinOutput: false,
							exit: false
						},
						cloudFoundryContext: {},
						pages: {
							completed: [],
							current: {
								title: 'Welcome',
								subtitle: 'welcome indeed',
								text: `welcome. welcome. welcome.

really. you are welcome.
`
							},
							next: [
								{
									text: 'let us login',
									command: {
										filename: 'cf',
										args: ['login']
									}
								},
								{
									text: 'let us deploy',
									command: {
										filename: 'cf',
										args: ['push']
									}
								}
							]
						}
					},
					middleware: config.defaultMiddleware
				}
				);
			});
		});

		describe('when in Ci mode', () => {
			beforeEach(() => {
				env = {CI: 'true'};

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

			it('parses into config', () => {
				expect(
					config.parse(configFile, env)
				).toStrictEqual({
					initialState: {
						app: {
							waitForTrigger: false,
							pinOutput: true,
							exit: false
						},
						cloudFoundryContext: {},
						pages: {
							completed: [],
							current: {
								title: 'Welcome',
								subtitle: 'welcome indeed',
								text: `welcome. welcome. welcome.

really. you are welcome.
`
							},
							next: [
								{
									text: 'let us login',
									command: {
										filename: 'cf',
										args: ['login', '-a', 'api.run.pivotal.io', '-u', 'cf-user', '-p', 'cf-password', '-o', 'cf-org', '-s', 'cf-space']
									}
								},
								{
									text: 'this is a ci only page',
									command: {
										filename: 'echo',
										args: ['this', 'command', 'only', 'runs', 'on', 'ci']
									}
								},
								{
									text: 'let us deploy',
									command: {
										filename: 'cf',
										args: ['push']
									}
								}
							]
						}
					},
					middleware: config.defaultMiddleware
				}
				);
			});
		});

		describe('when in Dry mode', () => {
			beforeEach(() => {
				env = {DRY: 'true'};
			});

			it('parses into config', () => {
				expect(
					config.parse(configFile, env)
				).toStrictEqual({
					initialState: {
						app: {
							waitForTrigger: true,
							pinOutput: false,
							exit: false
						},
						cloudFoundryContext: {},
						pages: {
							completed: [],
							current: {
								title: 'Welcome',
								subtitle: 'welcome indeed',
								text: `welcome. welcome. welcome.

really. you are welcome.
`
							},
							next: [
								{
									text: 'let us login',
									command: {
										filename: 'cf',
										args: ['login']
									}
								},
								{
									text: 'let us deploy',
									command: {
										filename: 'cf',
										args: ['push']
									}
								}
							]
						}
					},
					middleware: config.dryMiddleware
				}
				);
			});
		});
	});
});
