import * as React from 'react';
import {connect} from 'react-redux';
import {State} from './state';

type StateProps = {
	hasPages: boolean;
};

const mapStateToProps = (state: State): StateProps => ({
	hasPages: state.pages.current !== null
});

export const WhilePages = connect<StateProps>(mapStateToProps)(
	({children, hasPages}): React.ReactElement =>
		hasPages ? <>{children}</> : <></>
);
