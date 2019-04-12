import {runCommand} from './actions';
import {ciMiddleware} from './ci-middleware';

describe('CI Middleware', () => {
	let nextMiddlewareMock;
	let sut;

	beforeEach(() => {
		const store = null; // Does not use store
		nextMiddlewareMock = jest.fn();
		sut = ciMiddleware(store)(nextMiddlewareMock);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('when running command "cf login"', () => {
		beforeEach(() => {
			process.env.CF_USERNAME = 'cf-user';
			process.env.CF_PASSWORD = 'cf-password';
			process.env.CF_ORG = 'cf-org';
			process.env.CF_SPACE = 'cf-space';

			sut(runCommand('cf login --more args --go --here'));
		});

		afterEach(() => {
			delete process.env.CF_USERNAME;
			delete process.env.CF_PASSWORD;
			delete process.env.CF_ORG;
			delete process.env.CF_SPACE;
		});

		it('avoids user input by taking credentials from the environment and calling the the next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand('cf login -a api.run.pivotal.io -u cf-user -p cf-password -o cf-org -s cf-space'));
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('when running any other command', () => {
		beforeEach(() => {
			sut(runCommand('some --otherCommand --with args'));
		});

		it('avoids user input by taking credentials from the environment and calling the the next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(runCommand('some --otherCommand --with args'));
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});
});
