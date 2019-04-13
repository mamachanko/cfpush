import * as React from 'react';
import {Provider} from 'react-redux';
import {Dispatch} from 'redux';
import {Action, configureStore, Middleware, Store} from 'redux-starter-kit';
import {ciMiddleware} from './ci-middleware';
import {CurrentCommand} from './command';
import {createCommandRuntimeMiddleware} from './command-runtime-middleware';
import {Ci, Config, Dry, Mode, Tutorial} from './config'; // eslint-disable-line import/named
import {createDryMiddleware} from './dry-middleware';
import {ExitMessage} from './exit-message';
import {loggingMiddleware} from './logging-middleware';
import {Quitable} from './quitable';
import {reducer, State} from './reducer';
import {Title} from './title';
import {WhileCommands} from './while-commands';
import {createCfContextMiddleware} from './cf-context-middleware';

type AppProps = {
	store: Store;
}

const App: React.FC<AppProps> = ({store}): React.ReactElement => (
	<Provider store={store}>
		<WhileCommands>
			<Quitable exitDisplay={<ExitMessage/>}>
				<Title/>
				<CurrentCommand/>
			</Quitable>
		</WhileCommands>
	</Provider>
);

export const createApp = ({commands, mode}: Config): React.ReactElement => {
	const [firstCommand, ...next] = commands;

	const initialState: State = {
		app: {
			exit: false,
			waitForTrigger: mode !== Ci
		},
		commands: {
			completed: [],
			current: {
				command: firstCommand,
				status: 'UNSTARTED',
				output: []
			},
			next
		}
	};

	const store = configureStore<State, Action>({
		reducer,
		preloadedState: initialState,
		middleware: [
			...createMiddleware(mode),
			loggingMiddleware
		]});

	return <App store={store}/>;
};

const createMiddleware = (mode: Mode): ReadonlyArray<Middleware<{}, State, Dispatch<Action>>> => {
	switch (mode) {
		case (Tutorial): {
			return [createCfContextMiddleware(), createCommandRuntimeMiddleware()];
		}

		case (Ci): {
			return [createCfContextMiddleware(), ciMiddleware, createCommandRuntimeMiddleware()];
		}

		case (Dry): {
			return [createDryMiddleware()];
		}

		default:
			throw new Error(`unknown mode ${mode}`);
	}
};

