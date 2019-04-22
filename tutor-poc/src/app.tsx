import * as React from 'react';
import {Provider} from 'react-redux';
import {Action, configureStore, Store} from 'redux-starter-kit';
import {Config} from './config';
import {ErrorDisplay} from './error-message';
import {ExitMessage} from './exit-message';
import {CurrentPage} from './page';
import {Quitable} from './quitable';
import {reducer} from './reducer';
import {State} from './state';
import {WhilePages} from './while-pages';

type AppProps = {
	store: Store;
}

const App: React.FC<AppProps> = ({store}): React.ReactElement => (
	<Provider store={store}>
		<WhilePages>
			<Quitable
				exitDisplay={<ExitMessage/>}
				errorDisplay={<ErrorDisplay/>}
			>
				<CurrentPage/>
			</Quitable>
		</WhilePages>
	</Provider>
);

export const createApp = ({initialState, middleware}: Config): React.ReactElement => {
	const store = configureStore<State, Action>({
		reducer,
		middleware,
		preloadedState: initialState
	});

	return <App store={store}/>;
};
