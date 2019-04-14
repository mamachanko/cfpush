import * as execa from 'execa';

type GetHostname = (appName: string) => Promise<string>;

export interface CloudFoundryApi {
	getHostname: GetHostname;
}

const appStatus = async (appName: string): Promise<string> => (await execa('cf', ['app', appName])).stdout;

export const createCloudFoundryApi = (getAppStatus = appStatus): CloudFoundryApi => ({
	getHostname: async (appName: string): Promise<string> => {
		const appStatus = await getAppStatus(appName);
		return appStatus
			.match(/routes:\s*(?<hostname>[a-z0-1-]+)./i)
			.groups
			.hostname;
	}
});
