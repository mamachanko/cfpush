import {FINISHED, updateCfContext} from './actions';
import {CfContextUpdater, createCfContextUpdater} from './cf-context-updater';
import {Middleware} from './middleware';

export const createCfContextMiddleware = (cfContextUpdater: CfContextUpdater = createCfContextUpdater()): Middleware => store => next => async action => {
	const updateMaybe = async (): Promise<void> => {
		const {filename, args} = store.getState().pages.current.command;
		const update = await cfContextUpdater({filename, args});
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
