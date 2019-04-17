import {finished, stdoutReceived, RUN_COMMAND, started} from './actions';
import {Middleware} from './middleware'; // eslint-disable-line import/named
import {uid as defaultUid} from './uid';

export const createDryMiddleware = (uid = defaultUid): Middleware => store => next => action => {
	if (action.type === RUN_COMMAND) {
		store.dispatch(started());
		store.dispatch(stdoutReceived({text: `pretending to run "${store.getState().pages.current.command.command}"`, uid: uid()}));
		store.dispatch(finished());
	} else {
		next(action);
	}
};
