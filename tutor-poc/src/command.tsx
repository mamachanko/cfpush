import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {completed, inputReceived, runCommand} from './actions';
import {Column} from './column';
import * as CommandStatus from './command-status';
import {InputPrompt, useOnSpace} from './input';
import {Output} from './output';
import * as reducer from './reducer';

const CommandTrigger = ({command, run, waitForTrigger}): React.ReactElement => {
	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			run();
		}
	}, [waitForTrigger, run]);

	useOnSpace(run);

	return <Text>{`press <space> to run "${command.command}"`}</Text>;
};

const CompletePrompt = ({complete, waitForTrigger}): React.ReactElement => {
	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			complete();
		}
	}, [waitForTrigger, complete]);

	useOnSpace(complete);

	return (
		<Column>
			<Text>✅ finished</Text>
			<Text>{'done. press <space> to complete.'}</Text>
		</Column>
	);
};

const Running: React.FC = (): React.ReactElement => (
	<Box>
		<Box width={2}>
			<Spinner type="dots"/>
		</Box>
		<Text>running</Text>
	</Box>
);

type StateProps = {
	command: reducer.CurrentCommand;
	waitForTrigger: boolean;
};

type DispatchProps = {
	run: () => void;
	complete: () => void;
	submit: (input: string) => void;
}

export type CommandProps =
	& StateProps
	& DispatchProps;

export const Command: React.FC<CommandProps> = (props): React.ReactElement => {
	switch (props.command.status) {
		case (CommandStatus.RUNNING): {
			return (
				<Column>
					<Output {...props.command}/>
					<Running/>
				</Column>
			);
		}

		case (CommandStatus.INPUT_REQUIRED): {
			return (
				<Column>
					<Output {...props.command}/>
					<InputPrompt {...props}/>
				</Column>
			);
		}

		case (CommandStatus.FINISHED): {
			return (
				<Column>
					<Output {...props.command}/>
					<CompletePrompt {...props}/>
				</Column>
			);
		}

		default: {
			return (
				<Column>
					<CommandTrigger {...props}/>
				</Column>
			);
		}
	}
};

const mapStateToProps = (state: reducer.State): StateProps => ({
	command: state.commands.current,
	waitForTrigger: !state.ci
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
	run: () => dispatch(runCommand()),
	complete: () => dispatch(completed()),
	submit: (input: string) => dispatch(inputReceived(input))
});

export const CurrentCommand = connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Command);
