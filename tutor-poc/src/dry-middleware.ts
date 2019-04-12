import {Middleware, Dispatch, Action} from 'redux';
import {State} from './reducer';
import {started, outputReceived, finished, RUN_COMMAND} from './actions';
import {uid as defaultUid} from './uid';

export const createDryMiddleware = (uid = defaultUid): Middleware<{}, State, Dispatch<Action>> => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const dryMiddleware: Middleware<{}, State, Dispatch<Action>> = store => next => action => {
		if (action.type === RUN_COMMAND) {
			store.dispatch(started());
			store.dispatch(outputReceived(`pretending to run "${action.payload.command}"`, uid()));
			store.dispatch(finished(action.payload.command));
		} else {
			next(action);
		}
	};

	return dryMiddleware;
};
