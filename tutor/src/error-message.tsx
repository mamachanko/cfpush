import {Box} from 'ink';
import * as Link from 'ink-link';
import * as React from 'react';
import {connect} from 'react-redux';
import {Column} from './column';
import {CommandUtils} from './command-utils';
import {State} from './state';

type StateProps = {
	command: string;
}

const mapStateToProps = (state: State): StateProps => ({
	command: CommandUtils.toString(state.pages.current.command)
});

export const ErrorDisplay = connect<StateProps>(mapStateToProps)(
	({command}): React.ReactElement => {
		return (
			<Column margin={2} textWrap="wrap">
				<Box marginBottom={1}>
					{`🙇🏻‍♂️ sorry, the command "${command}" failed with a non-zero exit code 💀`}
				</Box>
				<Box>
                    For help, reach out at <Link url="github.com/mamachanko/cfpush/issues">github.com/mamachanko/cfpush/issues</Link>
				</Box>
			</Column>
		);
	}
);
