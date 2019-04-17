import * as React from 'react';
import {Provider} from 'react-redux';
import {Action, configureStore, Store} from 'redux-starter-kit';
import {createCfContextMiddleware} from './cf-context-middleware';
import {createCommandRuntimeMiddleware} from './command-runtime-middleware';
import {Ci, Config, Dry} from './config';
import {createDryMiddleware} from './dry-middleware';
import {ExitMessage} from './exit-message';
import {loggingMiddleware} from './logging-middleware';
import {Middlewares} from './middleware'; // eslint-disable-line import/named
import {CurrentPage} from './page';
import {Quitable} from './quitable';
import {reducer} from './reducer';
import {State, UNSTARTED} from './state';
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

	return {
		app: {
			exit: false,
			waitForTrigger: mode !== Ci
		},
		cloudFoundryContext: {},
		pages: {
			completed: [],
			current: {
				...first,
				commandStatus: UNSTARTED,
				output: []
			},
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
