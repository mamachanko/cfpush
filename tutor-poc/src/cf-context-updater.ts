import {CloudFoundryApi, createCloudFoundryApi} from './cloud-foundry';

export type CfContextUpdater = (command: string) => Promise<any>;

const isCfPush = (command: string): boolean => Boolean(command.match(/cf\s+push/i));

const parseAppName = (cfpush: string): string => cfpush
	.match(/\s*cf\s+push\s+(?<appName>[a-z-]+)/i)
	.groups
	.appName;

export const createCfContextUpdater = (cloudFoundryApi: CloudFoundryApi = createCloudFoundryApi()): CfContextUpdater => async (command: string) => {
	if (isCfPush(command)) {
		const appName = parseAppName(command);
		const hostname = await cloudFoundryApi.getHostname(appName);
		return {[appName]: {hostname}};
	}

	return {};
};
