import * as React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from 'redux-starter-kit';
import {ConnectedCommand} from './command';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';
import {Title} from './title';

const DATE = 'date';

const store = configureStore({
	reducer,
	middleware: [
		commandRuntime(),
		loggingMiddleware
	]
});

export const App: React.FunctionComponent<AppProps> = ({command = DATE}): React.ReactElement => {
	return (
		<Provider store={store}>
			<Title/>
			<ConnectedCommand command={command}/>
		</Provider>
	);
};

type AppProps = {
	command?: string;
}
