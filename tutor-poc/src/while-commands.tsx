import * as React from 'react';
import {connect} from 'react-redux';
import {State} from './reducer';

type StateProps = {
	hasCommands: boolean;
};

const mapStateToProps = (state: State): StateProps => ({
	hasCommands: state.commands.current !== undefined
});

export const WhileCommands = connect<StateProps>(mapStateToProps)(
	({children, hasCommands}): React.ReactElement => {
		if (hasCommands) {
			return <>{children}</>;
		}

		return null;
	}
);
