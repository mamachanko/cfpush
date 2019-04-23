import {CloudFoundryApi, createCloudFoundryApi} from './cloud-foundry';
import {Command} from './state';

export type CfContextUpdater = (command: Command) => Promise<any>;

const isCfPush = (command: Command): boolean => Boolean(
	command.filename === 'cf' &&
	command.args[0] === 'push'
);

const isCfCreateService = (command: Command): boolean => Boolean(
	command.filename === 'cf' &&
	command.args[0] === 'create-service'
);

const parseAppName = (cfPush: Command): string => cfPush.args[1];

const parseServiceInstanceName = (cfCreateService: Command): string => cfCreateService.args[3];

export const createCfContextUpdater = (cloudFoundryApi: CloudFoundryApi = createCloudFoundryApi()): CfContextUpdater => async (command: Command) => {
	if (isCfPush(command)) {
		const appName = parseAppName(command);
		const routes = await cloudFoundryApi.getRoutes(appName);
		return {[appName]: {routes}};
	}

	if (isCfCreateService(command)) {
		const serviceInstanceName = parseServiceInstanceName(command);
		await cloudFoundryApi.untilServiceCreated(serviceInstanceName);
	}

	return null;
};
