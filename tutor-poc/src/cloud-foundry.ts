import * as execa from 'execa';

type GetRoute = (appName: string) => Promise<string>;

export interface CloudFoundryApi {
	getRoute: GetRoute;
}

const getAppStatus = async (appName: string): Promise<string> =>
	(await execa('cf', ['app', appName])).stdout;

export const createCloudFoundryApi = (getAppStatus): CloudFoundryApi => ({
	getRoute: async (appName: string): Promise<string> => {
		const appStatus = await getAppStatus(appName);
		return appStatus
			.match(/routes:\s*(?<route>[a-z.-]+)/i)
			.groups
			.route;
	}
});

export const cloudFoundryApi: CloudFoundryApi = createCloudFoundryApi(getAppStatus);
