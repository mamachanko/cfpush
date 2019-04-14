import {CloudFoundryApi} from './cloud-foundry';
import {createCfContextUpdater, CfContextUpdater} from './cf-context-updater'; // eslint-disable-line import/named

describe('CfContextUpdater', () => {
	let sut: CfContextUpdater;
	const cloudFoundryApiMock: CloudFoundryApi = {
		getHostname: jest.fn()
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
			const update = await sut('cf push test-app --with more --args');

			expect(update).toStrictEqual({'test-app': {hostname: 'test-app-hostname'}});
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledWith('test-app');
			expect(cloudFoundryApiMock.getHostname).toHaveBeenCalledTimes(1);
		});
	});

	describe('when the command is not a "cf push"', () => {
		it('returns an empty object', async () => {
			const update = await sut('some command');

			expect(update).toStrictEqual({});
			expect(cloudFoundryApiMock.getHostname).not.toHaveBeenCalled();
		});
	});
});
