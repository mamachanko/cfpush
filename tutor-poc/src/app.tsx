import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {CurrentCommand} from './command';
import {createStore} from './store';
import {Title} from './title';
import {WhileCommands} from './while-commands';

const defaultStore = createStore({
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
});

export const App: React.FC<AppProps> = ({store = defaultStore}): React.ReactElement => (
	<Provider store={store}>
		<Title/>
		<WhileCommands>
			<CurrentCommand/>
		</WhileCommands>
	</Provider>
);

type AppProps = {
	store?: Store;
}
