import {CloudFoundryApi, createCloudFoundryApi} from './cloud-foundry';

const appStatus = `
Showing health and status for app chat-app in org cfpush / space cfpush-tutorial as user@example.com...
name:              test-app
requested state:   started
routes:            app-hostname-1.app-domain.com, app-hostname-2.app-domain.com, app.another-domain.io
last uploaded:     Thu 11 Apr 15:53:01 CEST 2019
stack:             cflinuxfs3
buildpacks:        staticfile
type:           web
instances:      1/1
memory usage:   64M
state     since                  cpu    memory        disk           details
#0   running   2019-04-11T13:53:25Z   0.2%   8.4M of 64M   6.7M of 128M
`;

const serviceStatusCreateSucceeded = `
Showing info of service database in org cfpush / space cfpush-tutorial as user@example.com...

name:            database
service:         elephantsql
tags:
plan:            turtle
description:     PostgreSQL as a Service
documentation:   http://docs.run.pivotal.io/marketplace/services/elephantsql.html
dashboard:       https://cloudfoundry.appdirect.com/api/custom/cloudfoundry/v2/sso/start?serviceUuid=123

Showing status of last operation from service database...

status:    create succeeded
message:
started:   2019-04-14T15:32:13Z
updated:   2019-04-14T15:32:13Z

There are no bound apps for this service.
`;

const serviceStatusPending = `
Showing info of service database in org cfpush / space cfpush-tutorial as user@example.com...

name:            database
service:         elephantsql
tags:
plan:            turtle
description:     PostgreSQL as a Service
documentation:   http://docs.run.pivotal.io/marketplace/services/elephantsql.html
dashboard:       https://cloudfoundry.appdirect.com/api/custom/cloudfoundry/v2/sso/start?serviceUuid=123

Showing status of last operation from service database...

status:    create pending
message:
started:   2019-04-14T15:32:13Z
updated:   2019-04-14T15:32:13Z

There are no bound apps for this service.
`;

describe('CloudFoundry', () => {
	const getAppStatus = jest.fn();
	const getServiceStatus = jest.fn();
	const cloudFoundry: CloudFoundryApi = createCloudFoundryApi(getAppStatus, getServiceStatus);

	afterEach(jest.resetAllMocks);

	describe('when getting an app\'s hostname', () => {
		beforeEach(() => {
			getAppStatus
				.mockResolvedValueOnce(appStatus);
		});
		it('returns app\'s first hostname', async () => {
			const hostname = await cloudFoundry.getHostname('test-app');

			expect(hostname).toEqual('app-hostname-1');
			expect(getAppStatus).toHaveBeenCalledWith('test-app');
			expect(getAppStatus).toHaveBeenCalledTimes(1);
		});
	});

	describe('when waiting for a service to be created', () => {
		beforeEach(() => {
			getServiceStatus
				.mockResolvedValueOnce(serviceStatusPending)
				.mockResolvedValueOnce(serviceStatusPending)
				.mockResolvedValueOnce(serviceStatusCreateSucceeded);
		});

		it('blocks until the service is created and returns its status', async () => {
			await cloudFoundry.untilServiceCreated('service-instance-name');

			expect(getServiceStatus).toHaveBeenCalledWith('service-instance-name');
			expect(getServiceStatus).toHaveBeenCalledTimes(3);
		});
	});
});
