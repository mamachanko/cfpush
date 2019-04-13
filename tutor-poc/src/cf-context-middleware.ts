import * as Mustache from 'mustache';
import {Dispatch, Middleware} from 'redux';
import {Action, FINISHED, runCommand, RUN_COMMAND} from './actions'; // eslint-disable-line import/named
import {CloudFoundryApi, cloudFoundryApi as defaultCloudFoundryApi} from './cloud-foundry';
import {State} from './reducer';
import {logger} from './logging';

const isCfPush = (command: string): boolean => Boolean(command.match(/cf\s+push/));
const parseAppName = (command: string): string => {
	const {appName} = command.match(/\s*cf\s+push\s+(?<appName>[a-z-]+)/i).groups;
	return appName;
};

export const createCfContextMiddleware = (cloudFoundryApi: CloudFoundryApi = defaultCloudFoundryApi): Middleware<{}, State, Dispatch<Action>> => {
	const context: any = {};

	const process = async (command: string): Promise<void> => {
		if (isCfPush(command)) {
			logger.info('it is a cf-push');
			const appName = parseAppName(command);
			logger.info(`app name is ${appName}`);
			context[appName] = {hostname: await cloudFoundryApi.getHostname(appName)};
		} else {
			logger.info('it is not a cf-push');
		}
	};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const cfContextMiddleware: Middleware<{}, State, Dispatch<Action>> = _ => next => async action => {
		switch (action.type) {
			case (RUN_COMMAND): {
				const command = Mustache.render(action.payload.command, context);
				logger.info(`rendered command: "${command}" by using context "${JSON.stringify(context)}"`);
				next(runCommand(command));
				break;
			}

			case (FINISHED): {
				await process(action.payload.command);
				logger.info(`processed command. new context "${JSON.stringify(context)}"`);
				next(action);
				break;
			}

			default:
				logger.info('cf-context-middleware just passing through');
				next(action);
		}
	};

	return cfContextMiddleware;
};
