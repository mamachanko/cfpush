import {Dispatch, Middleware} from 'redux';
import {Action, FINISHED, updateCfContext} from './actions'; // eslint-disable-line import/named
import {State} from './reducer';
import {CfContextUpdater, createCfContextUpdater} from './cf-context-updater'; // eslint-disable-line import/named

export const createCfContextMiddleware = (cfContextUpdater: CfContextUpdater = createCfContextUpdater()): Middleware<{}, State, Dispatch<Action>> => store => next => async action => {
	const updateMaybe = async (): Promise<void> => {
		const {command} = store.getState().commands.current;
		const update = await cfContextUpdater(command);
		if (update) {
			store.dispatch(updateCfContext(update));
		}
	};

	switch (action.type) {
		case (FINISHED): {
			await updateMaybe();
		}
		// Falls through

		default:
			next(action);
	}
};
