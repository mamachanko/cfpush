import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {Text, Static} from 'ink';
import {CurrentCommand} from './command';
import {createStore} from './store';
import {Title} from './title';
import {WhileCommands} from './while-commands';
import {Quitable} from './quitable';

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

const exitDisplay = (
	<Static>
		<Text>ok.</Text>
		<Text>bye.</Text>
	</Static>
);

export const App: React.FC<AppProps> = ({store = defaultStore}): React.ReactElement => (
	<Provider store={store}>
		<Quitable exitDisplay={exitDisplay}>
			<WhileCommands>
				<Title/>
				<CurrentCommand/>
			</WhileCommands>
		</Quitable>
	</Provider>
);

type AppProps = {
	store?: Store;
}
