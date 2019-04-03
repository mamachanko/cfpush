import * as React from 'react';
import {Provider} from 'react-redux';
import {Store} from 'redux-starter-kit';
import {activateCiMode, activateDryMode} from './actions';
import {ConnectedCommand} from './command';
import {createStore} from './store';
import {Title} from './title';

const appStore = createStore();

export const App: React.FunctionComponent<AppProps> = ({command = 'date', ci = false, dry = false, store = appStore}): React.ReactElement => {
	React.useLayoutEffect(() => {
		if (ci) {
			store.dispatch(activateCiMode());
		}

		if (dry) {
			store.dispatch(activateDryMode());
		}
	}, [store, ci, dry]);

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
	ci?: boolean;
	dry?: boolean;
}
