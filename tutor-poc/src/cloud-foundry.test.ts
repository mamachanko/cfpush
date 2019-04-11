import {CloudFoundry, createCloudFoundry} from './cf';

const appStatus = `
Showing health and status for app chat-app in org cfpush / space cfpush-tutorial as user@example.com...

name:              test-app
requested state:   started
routes:            app-hostname.app-domain.com
last uploaded:     Thu 11 Apr 15:53:01 CEST 2019
stack:             cflinuxfs3
buildpacks:        staticfile

type:           web
instances:      1/1
memory usage:   64M
state     since                  cpu    memory        disk           details
#0   running   2019-04-11T13:53:25Z   0.2%   8.4M of 64M   6.7M of 128M
`;

describe('CloudFoundry', () => {
	const getAppStatus = jest.fn().mockResolvedValueOnce(appStatus);
	const cloudFoundry: CloudFoundry = createCloudFoundry(getAppStatus);

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('returns app route', async () => {
		const appRoute = await cloudFoundry.getRoute('test-app');

		expect(appRoute).toEqual('app-hostname.app-domain.com');
		expect(getAppStatus).toHaveBeenCalledWith('test-app');
		expect(getAppStatus).toHaveBeenCalledTimes(1);
	});
});
