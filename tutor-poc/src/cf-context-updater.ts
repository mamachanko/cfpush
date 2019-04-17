import {CloudFoundryApi, createCloudFoundryApi} from './cloud-foundry';
import {Command} from './state'; // eslint-disable-line import/named

export type CfContextUpdater = (command: Command) => Promise<any>;

const isCfPush = (command: Command): boolean => Boolean(command.command.match(/cf\s+push/i));

const isCfCreateService = (command: Command): boolean => Boolean(command.command.match(/cf\s+create-service/i));

const parseAppName = (cfPush: Command): string =>
	cfPush
		.command
		.match(/\s*cf\s+push\s+(?<appName>[a-z-]+)/i)
		.groups
		.appName;

const parseServiceInstanceName = (cfCreateService: Command): string =>
	cfCreateService
		.command
		.match(/cf\s+create-service\s+(?<serviceName>[a-z-]+)\s+(?<planName>[a-z-]+)\s+(?<serviceInstanceName>[a-z-]+)/)
		.groups
		.serviceInstanceName;

export const createCfContextUpdater = (cloudFoundryApi: CloudFoundryApi = createCloudFoundryApi()): CfContextUpdater => async (command: Command) => {
	if (isCfPush(command)) {
		const appName = parseAppName(command);
		const hostname = await cloudFoundryApi.getHostname(appName);
		return {[appName]: {hostname}};
	}

	if (isCfCreateService(command)) {
		const serviceInstanceName = parseServiceInstanceName(command);
		await cloudFoundryApi.untilServiceCreated(serviceInstanceName);
	}

	return null;
};
