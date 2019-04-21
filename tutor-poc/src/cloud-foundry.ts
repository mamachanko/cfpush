import * as execa from 'execa';

export const createCloudFoundryApi = (getAppStatus = appStatus, getServiceStatus = serviceStatus): CloudFoundryApi => ({

	getRoutes: async (appName: string): Promise<Route[]> => {
		const appStatus = await getAppStatus(appName);
		return appStatus
			.match(/routes:\s+(?<routes>[\w.\-, ]+)+/i)
			.groups
			.routes
			.split(', ')
			.map(route => {
				const [hostname, ...domainParts] = route.split('.');
				return ({
					hostname,
					domain: domainParts.join('.'),
					url: `https://${route}`
				});
			});
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

export interface CloudFoundryApi {
	getRoutes: GetRoutes;
	untilServiceCreated: UntilServiceCreated;
}

type GetRoutes = (appName: string) => Promise<Route[]>;

type Route = {
	hostname: string;
	domain: string;
	url: string;
}

type UntilServiceCreated = (serviceInstanceName: string) => Promise<void>;

const appStatus = async (appName: string): Promise<string> => (await execa('cf', ['app', appName])).stdout;
const serviceStatus = async (serviceInstanceName: string): Promise<string> => (await execa('cf', ['service', serviceInstanceName])).stdout;
const sleep = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
