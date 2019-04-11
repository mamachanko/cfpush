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
import * as config from './config';

const [firstCommand, ...next] = config.tutorial;

const defaultStore = createStore({
	...initialState,
	app: {
		...initialState.app,
		ci: config.ci,
		dry: config.dry
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
