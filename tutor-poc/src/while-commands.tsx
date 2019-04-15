import * as React from 'react';
import {connect} from 'react-redux';
import {State} from './state';

type StateProps = {
	hasCommands: boolean;
};

const mapStateToProps = (state: State): StateProps => ({
	hasCommands: state.pages.current !== undefined
});

export const WhileCommands = connect<StateProps>(mapStateToProps)(
	({children, hasCommands}): React.ReactElement => {
		if (hasCommands) {
			return <>{children}</>;
		}

		return <></>;
	}
);
