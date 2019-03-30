import * as React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from 'redux-starter-kit';
import {Command} from './command';
import {commandRuntime} from './command-runtime';
import {loggingMiddleware} from './logging-middleware';
import {reducer} from './reducer';
import {Title} from './title';

const CF_LOGIN = 'cf login -a api.run.pivotal.io --sso';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DATE = 'date';

const store = configureStore({
	reducer,
	middleware: [
		commandRuntime(),
		loggingMiddleware
	]
});

export const App: React.FunctionComponent<AppProps> = ({command = CF_LOGIN}): React.ReactElement => {
	return (
		<Provider store={store}>
			<Title/>
			<Command command={command}/>
		</Provider>
	);
};

type AppProps = {
	command?: string;
}
