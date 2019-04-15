import {Action, Dispatch, Middleware} from 'redux';
import {finished, outputReceived, RUN_COMMAND, started} from './actions';
import {State} from './state';
import {uid as defaultUid} from './uid';

export const createDryMiddleware = (uid = defaultUid): Middleware<{}, State, Dispatch<Action>> => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const dryMiddleware: Middleware<{}, State, Dispatch<Action>> = store => next => action => {
		if (action.type === RUN_COMMAND) {
			store.dispatch(started());
			store.dispatch(outputReceived(`pretending to run "${store.getState().commands.current.command}"`, uid()));
			store.dispatch(finished());
		} else {
			next(action);
		}
	};

	return dryMiddleware;
};
