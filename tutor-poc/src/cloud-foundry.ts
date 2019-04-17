import * as execa from 'execa';

type GetHostname = (appName: string) => Promise<string>;
type UntilServiceCreated = (serviceInstanceName: string) => Promise<void>;

export interface CloudFoundryApi {
	getHostname: GetHostname;
	untilServiceCreated: UntilServiceCreated;
}

const appStatus = async (appName: string): Promise<string> => (await execa('cf', ['app', appName])).stdout;
const serviceStatus = async (serviceInstanceName: string): Promise<string> => (await execa('cf', ['service', serviceInstanceName])).stdout;
const sleep = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const createCloudFoundryApi = (getAppStatus = appStatus, getServiceStatus = serviceStatus): CloudFoundryApi => ({
	getHostname: async (appName: string): Promise<string> => {
		const appStatus = await getAppStatus(appName);
		return appStatus
			.match(/routes:\s*(?<hostname>[a-z0-1-]+)./i)
			.groups
			.hostname;
	},
	untilServiceCreated: async (serviceInstanceName: string): Promise<void> => {
		let serviceStatus = '';
		do {
			/* eslint-disable no-await-in-loop */
			serviceStatus = await getServiceStatus(serviceInstanceName);
			await sleep(1000);
			/* eslint-enable */
		}
		while (!serviceStatus.match(/create succeeded/i));
	}
});