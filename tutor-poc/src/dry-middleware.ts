import {finished, RUN_COMMAND, started, stdoutReceived} from './actions';
import {CommandUtils} from './command-utils';
import {Middleware} from './middleware';
import {uid as defaultUid} from './uid';

export const createDryMiddleware = (uid = defaultUid): Middleware => store => next => action => {
	if (action.type === RUN_COMMAND) {
		store.dispatch(started());
		store.dispatch(stdoutReceived({text: `pretending to run "${CommandUtils.toString(store.getState().pages.current.command)}"`, uid: uid()}));
		store.dispatch(finished());
	} else {
		next(action);
	}
};
