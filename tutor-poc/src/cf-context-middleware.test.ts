import {finished, updateCfContext} from './actions';
import {createCfContextMiddleware} from './cf-context-middleware';
import {CloudFoundryApi} from './cloud-foundry';
import {createStoreMock} from './test-utils';

describe('CF Context Middleware', () => {
	let storeMock;
	let nextMiddlewareMock;
	let cloudFoundryApiMock: CloudFoundryApi;
	let sut;

	beforeEach(() => {
		cloudFoundryApiMock = {
			getHostname: jest.fn().mockResolvedValueOnce('test-app-hostname')
		};
		storeMock = createStoreMock({
			commands: {
				current: {
					command: 'cf push test-app --more args --go --here'
				}
			}
		});
		nextMiddlewareMock = jest.fn();
		sut = createCfContextMiddleware(cloudFoundryApiMock)(storeMock)(nextMiddlewareMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when current command "cf push" finishes', () => {
		beforeEach(async () => {
			await sut(finished());
		});

		it('updates CF context with the app hostname', () => {
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledWith('test-app');
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledTimes(1);

			expect(storeMock.dispatch).toHaveBeenCalledWith(updateCfContext({'test-app': {hostname: 'test-app-hostname'}}));
			expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
		});

		it('calls the next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(finished());
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});
	});
});
