import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {CurrentCommand} from './command';
import {State} from './reducer';
import {createStore} from './store';
import {Title} from './title';
import {WhileCommands} from './while-commands';

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

const appStore = createStore(initialState);

export const App: React.FunctionComponent<AppProps> = ({store = appStore}): React.ReactElement => (
	<Provider store={store}>
		<Title/>
		<WhileCommands>
			<CurrentCommand/>
		</WhileCommands>
	</Provider>
);

export type AppProps = {
	store?: Store;
}
