import {AppContext} from 'ink';
import * as React from 'react';
import {connect} from 'react-redux';
import {exitApp} from './actions';
import {useOnCtrlC} from './input';
import {State} from './state';

type OwnProps = {
	exitDisplay: React.ReactElement;
	errorDisplay: React.ReactElement;
};

type DispatchProps = {
	scheduleExit: () => void;
}

type StateProps = {
	shouldExitNow: boolean;
	error: boolean;
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
	scheduleExit: () => dispatch(exitApp())
});

const mapStateToProps = (state: State): StateProps => ({
	shouldExitNow: state.app.exit,
	error: state.pages.current.command && state.pages.current.command.error
});

const isTest = (): boolean => process.env.NODE_ENV === 'test';

export const Quitable = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(
	({children, error, exitDisplay, errorDisplay, scheduleExit, shouldExitNow}): React.ReactElement => {
		const {exit} = React.useContext(AppContext);

		React.useEffect(() => {
			if (shouldExitNow) {
				exit((error && !isTest()) ? new Error() : null);
			}
		}, [error, exit, shouldExitNow]);

		useOnCtrlC(scheduleExit);

		const display = error ? errorDisplay : exitDisplay;

		return shouldExitNow ? display : <>{children}</>;
	}
);
