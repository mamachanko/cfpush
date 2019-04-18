import {CfContextUpdater, createCfContextUpdater} from './cf-context-updater';
import {CloudFoundryApi} from './cloud-foundry';

describe('CfContextUpdater', () => {
	let sut: CfContextUpdater;
	const cloudFoundryApiMock: CloudFoundryApi = {
		getHostname: jest.fn(),
		untilServiceCreated: jest.fn()
	};

	beforeEach(() => {
		sut = createCfContextUpdater(cloudFoundryApiMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when the command is a "cf push"', () => {
		beforeEach(() => {
			(cloudFoundryApiMock.getHostname as jest.Mock).mockResolvedValueOnce('test-app-hostname');
		});

		it('returns the pushed app\'s hostname', async () => {
			const update = await sut({filename: 'cf', args: ['push', 'test-app', '--with', 'more', '--args']});

			expect(update).toStrictEqual({'test-app': {hostname: 'test-app-hostname'}});
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledWith('test-app');
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledTimes(1);
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
			expect(cloudFoundryApiMock.getHostname).not.toHaveBeenCalled();
		});
	});
});
