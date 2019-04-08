import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {Text, Static, AppContext, StdinContext} from 'ink';
import {CurrentCommand} from './command';
import {createStore} from './store';
import {Title} from './title';
import {WhileCommands} from './while-commands';
import {Quitable} from './quitable';
import {useStdin} from './use-stdin';
import {logger} from './logging';
import {exitApp} from './actions';

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

export const App: React.FC<AppProps> = ({store = defaultStore}): React.ReactElement => {
	const {exit} = React.useContext(AppContext);
	const [shouldExit, dispatch] = React.useReducer(
		(_, action) => action.type === 'EXIT',
		false
	);

	React.useEffect(() => {
		if (shouldExit) {
			exit();
		}
	}, [exit, shouldExit]);

	useStdin((_, key) => {
		if (key.name === 'c' && key.ctrl) {
			logger.debug('CTRL-C -> INSTRUCTED TO EXIT.');
			store.dispatch(exitApp());
			dispatch({type: 'EXIT'});
		}
	});

	logger.debug(`SHOULD EXIT: ${shouldExit}`);

	if (shouldExit) {
		return exitDisplay;
	}

	return (
		<Provider store={store}>
			<WhileCommands>
				<Title/>
				<CurrentCommand/>
			</WhileCommands>
		</Provider>
	);
};

type AppProps = {
	store?: Store;
}
