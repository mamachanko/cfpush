import {Dispatch, Middleware} from 'redux';
import {Action, FINISHED, updateCfContext} from './actions'; // eslint-disable-line import/named
import {CloudFoundryApi, cloudFoundryApi as defaultCloudFoundryApi} from './cloud-foundry';
import {State} from './reducer';

const isCfPush = (command: string): boolean => Boolean(command.match(/cf\s+push/));
const parseAppName = (command: string): string => {
	const {appName} = command.match(/\s*cf\s+push\s+(?<appName>[a-z-]+)/i).groups;
	return appName;
};

export const createCfContextMiddleware = (cloudFoundryApi: CloudFoundryApi = defaultCloudFoundryApi): Middleware<{}, State, Dispatch<Action>> => {
	const update = async (command: string): Promise<any> => {
		if (isCfPush(command)) {
			const appName = parseAppName(command);
			const hostname = await cloudFoundryApi.getHostname(appName);
			return {[appName]: {hostname}};
		}

		return {};
	};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const cfContextMiddleware: Middleware<{}, State, Dispatch<Action>> = store => next => async action => {
		switch (action.type) {
			case (FINISHED): {
				const cfContextUpdate = await update(action.payload.command);
				store.dispatch(updateCfContext(cfContextUpdate));
			}
			// Falls through

			default:
				next(action);
		}
	};

	return cfContextMiddleware;
};
