import {Dispatch, Middleware} from 'redux';
import {Action, runCommand, RunCommand, RUN_COMMAND} from './actions'; // eslint-disable-line import/named
import {State} from './reducer';

const cfCiLogin = (): string => [
	'cf',
	'login',
	'-a',
	'api.run.pivotal.io',
	'-u',
	process.env.CF_USERNAME,
	'-p',
	process.env.CF_PASSWORD,
	'-o',
	process.env.CF_ORG,
	'-s',
	process.env.CF_SPACE
].join(' ');

const isCfLogin = (runCommand: RunCommand): boolean => Boolean(runCommand.payload.command.match(/cf\s+login/));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ciMiddleware: Middleware<{}, State, Dispatch<Action>> = _ => next => action => {
	if (action.type === RUN_COMMAND && isCfLogin(action)) {
		next(runCommand(cfCiLogin()));
	} else {
		next(action);
	}
};
