import {FINISHED, updateCfContext} from './actions';
import {CfContextUpdater, createCfContextUpdater} from './cf-context-updater'; // eslint-disable-line import/named
import {Middleware} from './middleware'; // eslint-disable-line import/named

export const createCfContextMiddleware = (cfContextUpdater: CfContextUpdater = createCfContextUpdater()): Middleware => store => next => async action => {
	const updateMaybe = async (): Promise<void> => {
		const {command} = store.getState().pages.current;
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
