import {CloudFoundryApi, createCloudFoundryApi} from './cloud-foundry';
import {Command} from './state'; // eslint-disable-line import/named

export type CfContextUpdater = (command: Command) => Promise<any>;

const isCfPush = (command: Command): boolean => Boolean(command.command.match(/cf\s+push/i));

const parseAppName = (cfpush: Command): string =>
	cfpush
		.command
		.match(/\s*cf\s+push\s+(?<appName>[a-z-]+)/i)
		.groups
		.appName;

export const createCfContextUpdater = (cloudFoundryApi: CloudFoundryApi = createCloudFoundryApi()): CfContextUpdater => async (command: Command) => {
	if (isCfPush(command)) {
		const appName = parseAppName(command);
		const hostname = await cloudFoundryApi.getHostname(appName);
		return {[appName]: {hostname}};
	}

	if (command.command.match(/cf\s+create-service/i)) {
		const {serviceInstanceName} = command.command.match(/cf\s+create-service\s+(?<serviceName>[a-z-]+)\s+(?<planName>[a-z-]+)\s+(?<serviceInstanceName>[a-z-]+)/).groups;
		await cloudFoundryApi.untilServiceCreated(serviceInstanceName);
	}

	return null;
};
