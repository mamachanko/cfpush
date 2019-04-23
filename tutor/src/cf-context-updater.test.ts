import {CfContextUpdater, createCfContextUpdater} from './cf-context-updater';
import {CloudFoundryApi} from './cloud-foundry';

describe('CfContextUpdater', () => {
	let sut: CfContextUpdater;
	const cloudFoundryApiMock: CloudFoundryApi = {
		getRoutes: jest.fn(),
		untilServiceCreated: jest.fn()
	};

	beforeEach(() => {
		sut = createCfContextUpdater(cloudFoundryApiMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when the command is a "cf push"', () => {
		beforeEach(() => {
			(cloudFoundryApiMock.getRoutes as jest.Mock).mockResolvedValueOnce([
				{hostname: 'app-hostname-1', domain: 'app-domain.com', url: 'https://app-hostname-1.app-domain.com'},
				{hostname: 'app-hostname-2', domain: 'app-domain.com', url: 'https://app-hostname-2.app-domain.com'}
			]);
		});

		it('returns the pushed app\'s routes', async () => {
			const update = await sut({filename: 'cf', args: ['push', 'test-app', '--with', 'more', '--args']});

			expect(update).toStrictEqual({
				'test-app': {
					routes: [
						{hostname: 'app-hostname-1', domain: 'app-domain.com', url: 'https://app-hostname-1.app-domain.com'},
						{hostname: 'app-hostname-2', domain: 'app-domain.com', url: 'https://app-hostname-2.app-domain.com'}
					]
				}
			});
			expect(cloudFoundryApiMock.getRoutes).toHaveBeenCalledWith('test-app');
			expect(cloudFoundryApiMock.getRoutes).toHaveBeenCalledTimes(1);
		});
	});

	describe('when the command is "cf create-service"', () => {
		it('waits until the service is created', async () => {
			await sut({filename: 'cf', args: ['create-service', 'service-name', 'plan-name', 'service-instance-name']});

			expect(cloudFoundryApiMock.untilServiceCreated).toHaveBeenCalledWith('service-instance-name');
			expect(cloudFoundryApiMock.untilServiceCreated).toHaveBeenCalledTimes(1);
		});
	});

	describe('when the command is not interesting', () => {
		it('returns an empty object', async () => {
			const update = await sut({filename: 'some', args: ['command']});

			expect(update).toBeNull();
			expect(cloudFoundryApiMock.getRoutes).not.toHaveBeenCalled();
		});
	});
});
