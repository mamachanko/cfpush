import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {CurrentCommand} from './command';
import {ExitMessage} from './exit-message';
import {Quitable} from './quitable';
import {initialState} from './reducer';
import {createStore} from './store';
import {Title} from './title';
import {WhileCommands} from './while-commands';

const defaultStore = createStore({
	...initialState,
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

type AppProps = {
	store?: Store;
}

export const App: React.FC<AppProps> = ({store = defaultStore}): React.ReactElement => (
	<Provider store={store}>
		<WhileCommands>
			<Quitable exitDisplay={<ExitMessage/>}>
				<Title/>
				<CurrentCommand/>
			</Quitable>
		</WhileCommands>
	</Provider>
);
