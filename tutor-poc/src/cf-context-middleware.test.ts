import {Dispatch, Middleware} from 'redux';
import {Action, finished, FINISHED, runCommand, RUN_COMMAND} from './actions'; // eslint-disable-line import/named
import {CloudFoundryApi} from './cloud-foundry';
import {State} from './reducer';

const isCfPush = (command: string): boolean => Boolean(command.match(/cf\s+push/));
const parseAppName = (command: string): string => {
	const {appName} = command.match(/\s*cf\s+push\s+(?<appName>[a-z-]+)/i).groups;
	return appName;
};

const createCfContextMiddleware = (cloudFoundryApi: CloudFoundryApi): Middleware<{}, State, Dispatch<Action>> => {
	const context: any = {};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const cfContextMiddleware = _ => next => async action => {
		if (action.type === FINISHED && isCfPush(action.payload.command)) {
			const appName = parseAppName(action.payload.command);
			context.route = await cloudFoundryApi.getRoute(appName);
		}

		if (action.type === RUN_COMMAND && action.payload.command.match(/\${TEST_APP_HOSTNAME}/)) {
			// Todo: Mustache.render
			next(runCommand(action.payload.command.replace('${TEST_APP_HOSTNAME}', context.route)));
			return;
		}

		next(action);
	};

	return cfContextMiddleware;
};

describe('CF Context Middleware', () => {
	let nextMiddlewareMock;
	let cloudFoundryApiMock: CloudFoundryApi;
	let sut;

	beforeEach(() => {
		cloudFoundryApiMock = {
			getRoute: jest.fn().mockResolvedValueOnce('test-app-hostname.test-app-domain.com')
		};
		nextMiddlewareMock = jest.fn();
		sut = createCfContextMiddleware(cloudFoundryApiMock)(null)(nextMiddlewareMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when command "cf push" finishes', () => {
		beforeEach(async () => {
			sut(finished('cf push test-app'));
		});

		it('gets status of the pushed app', () => {
			expect(cloudFoundryApiMock.getRoute).toHaveBeenCalledWith('test-app');
			expect(cloudFoundryApiMock.getRoute).toHaveBeenCalledTimes(1);
		});

		it('calls the next middleware', () => {
			expect(nextMiddlewareMock).toHaveBeenCalledWith(finished('cf push test-app'));
			expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
		});

		describe('when running a command that contains "{{TEST_APP_HOSTNAME}}"', () => {
			beforeEach(() => {
				sut(runCommand('test command {{TEST_APP_HOSTNAME}}'));
			});

			it('renders the placeholder and calls the middleware with it', () => {
				expect(nextMiddlewareMock).toHaveBeenNthCalledWith(2, runCommand('test command test-app-hostname.test-app-domain.com'));
				expect(nextMiddlewareMock).toHaveBeenCalledTimes(2);
			});
		});
	});
});
