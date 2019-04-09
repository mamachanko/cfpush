import {AppContext} from 'ink';
import * as React from 'react';
import {connect} from 'react-redux';
import {exitApp} from './actions';
import {Key, useStdin} from './input';
import {State} from './reducer';

type OwnProps = {
	exitDisplay: React.ReactElement;
};

type DispatchProps = {
	scheduleExit: () => void;
}

type StateProps = {
	lastCallToExit: boolean;
}

type Props =
	& OwnProps
	& DispatchProps
	& StateProps;

const mapDispatchToProps = (dispatch): DispatchProps => ({
	scheduleExit: () => dispatch(exitApp())
});

const mapStateToProps = (state: State): StateProps => ({
	lastCallToExit: state.exit
});

const _Quitable: React.FC<Props> = ({children, exitDisplay, scheduleExit, lastCallToExit}): React.ReactElement => {
	const {exit} = React.useContext(AppContext);

	React.useEffect(() => {
		if (lastCallToExit) {
			exit();
		}
	}, [exit, lastCallToExit]);

	useStdin((_: string, key: Key) => {
		if (key.ctrl && key.name === 'c') {
			scheduleExit();
		}
	});

	return lastCallToExit ? exitDisplay : <>{children}</>;
};

export const Quitable = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(_Quitable);
