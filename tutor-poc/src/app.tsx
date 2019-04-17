import * as React from 'react';
import {Provider} from 'react-redux';
import {Action, configureStore, Store} from 'redux-starter-kit';
import {createCfContextMiddleware} from './cf-context-middleware';
import {createCommandRuntimeMiddleware} from './command-runtime-middleware';
import {Ci, Config, Dry} from './config'; // eslint-disable-line import/named
import {createDryMiddleware} from './dry-middleware';
import {ExitMessage} from './exit-message';
import {loggingMiddleware} from './logging-middleware';
import {Middlewares} from './middleware'; // eslint-disable-line import/named
import {CurrentPage} from './page';
import {Quitable} from './quitable';
import {reducer} from './reducer';
import {State, UNSTARTED, Page, CurrentCommand} from './state'; // eslint-disable-line import/named
import {WhilePages} from './while-pages';

type AppProps = {
	store: Store;
}

const App: React.FC<AppProps> = ({store}): React.ReactElement => (
	<Provider store={store}>
		<WhilePages>
			<Quitable exitDisplay={<ExitMessage/>}>
				<CurrentPage/>
			</Quitable>
		</WhilePages>
	</Provider>
);

export const createApp = (config: Config): React.ReactElement => {
	const store = configureStore<State, Action>({
		reducer,
		middleware: createMiddleware(config),
		preloadedState: createInitialState(config)
	});

	return <App store={store}/>;
};

const createInitialState = ({pages, mode}: Config): State => {
	const [first, ...next] = pages;

	const current: Page<CurrentCommand> = first.command ? {
		...first,
		command: {
			command: first.command.command,
			status: UNSTARTED,
			stdout: []
		}
	} : {...first, command: null};

	return {
		app: {
			exit: false,
			waitForTrigger: mode !== Ci
		},
		cloudFoundryContext: {},
		pages: {
			completed: [],
			current,
			next
		}
	};
};

const createMiddleware = ({mode}: Config): Middlewares =>
	mode === Dry ?
		[
			createDryMiddleware(),
			loggingMiddleware
		] :
		[
			createCommandRuntimeMiddleware(),
			createCfContextMiddleware(),
			loggingMiddleware
		];
