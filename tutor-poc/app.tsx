import {AppContext} from 'ink';
import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {ConnectedCommand} from './command';
import {log} from './logging';
import {State} from './reducer';
import {createStore} from './store';
import {Title} from './title';

const initialState: State = {
	ci: process.env.CI === 'true',
	dry: process.env.DRY === 'true',
	commands: {
		completed: [],
		current: {
			command: 'cf login -a api.run.pivotal.io --sso',
			status: 'UNSTARTED',
			output: []
		},
		next: ['cf logout']
	}
};

log(`\n--- ${new Date()} ---`);
log(`initial state: ${JSON.stringify(initialState)}`);

const appStore = createStore(initialState);

export const App: React.FunctionComponent<AppProps> = ({store = appStore, exit = undefined}): React.ReactElement => {
	const {exit: defaultExit} = React.useContext(AppContext);

	return (
		<Provider store={store}>
			<Title/>
			<ConnectedCommand exit={exit ? exit : defaultExit}/>
		</Provider>
	);
};

export type AppProps = {
	store?: Store;
	exit?: () => void;
}
