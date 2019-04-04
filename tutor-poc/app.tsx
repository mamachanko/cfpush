import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {ConnectedCommand} from './command';
import {createStore} from './store';
import {Title} from './title';
import {State} from './reducer';
import {log} from './logging';

const initialState: State = {
	ci: process.env.CI === 'true',
	dry: process.env.DRY === 'true',
	status: 'UNSTARTED',
	output: []
};

log(`initial state: ${JSON.stringify(initialState)}`);

const appStore = createStore(initialState);

export const App: React.FunctionComponent<AppProps> = ({command = 'date', store = appStore}): React.ReactElement => {
	return (
		<Provider store={store}>
			<Title/>
			<ConnectedCommand command={command}/>
		</Provider>
	);
};

export type AppProps = {
	store?: Store;
	command?: string;
}
