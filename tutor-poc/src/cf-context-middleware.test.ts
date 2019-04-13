import {finished, runCommand} from './actions';
import {CloudFoundryApi} from './cloud-foundry';
import {createCfContextMiddleware} from './cf-context-middleware';

describe('CF Context Middleware', () => {
	let nextMiddlewareMock;
	let cloudFoundryApiMock: CloudFoundryApi;
	let sut;

	beforeEach(() => {
		cloudFoundryApiMock = {
			getHostname: jest.fn().mockResolvedValueOnce('test-app-hostname')
		};
		nextMiddlewareMock = jest.fn();
		sut = createCfContextMiddleware(cloudFoundryApiMock)(null)(nextMiddlewareMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when command "cf push" finishes', () => {
		beforeEach(async () => {
			await sut(finished('cf push test-app --more args --go --here'));
		});

		it('gets status of the pushed app', () => {
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledWith('test-app');
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledTimes(1);
		});

		it('calls the next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(finished('cf push test-app --more args --go --here'));
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});

		describe('when running a command that contains "{{test-app.hostname}}"', () => {
			beforeEach(async () => {
				await sut(runCommand('test command --arg {{test-app.hostname}} --someMore args'));
			});

			it('renders the test-app\'s hostname and calls the next middleware with it', () => {
				expect(nextMiddlewareMock).toHaveBeenNthCalledWith(2, runCommand('test command --arg test-app-hostname --someMore args'));
				expect(nextMiddlewareMock).toHaveBeenCalledTimes(2);
			});
		});
	});
});
