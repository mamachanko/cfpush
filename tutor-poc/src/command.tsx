import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {completed, inputReceived, runCommand} from './actions';
import {Column} from './column';
import * as CommandStatus from './command-status';
import {useOnSpace} from './input';
import {InputPrompt} from './input-prompt';
import {Output} from './output';
import * as reducer from './reducer';

const CommandTrigger = ({currentCommand: {command}, run, waitForTrigger}): React.ReactElement => {
	const runCommand = React.useCallback(() => run(command), [run, command]);

	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			runCommand();
		}
	}, [waitForTrigger, runCommand]);

	useOnSpace(runCommand);

	return <Text>{`press <space> to run "${command}"`}</Text>;
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
	currentCommand: reducer.CurrentCommand;
	waitForTrigger: boolean;
};

type DispatchProps = {
	run: (command: string) => void;
	complete: () => void;
	submit: (input: string) => void;
}

export type CommandProps =
	& StateProps
	& DispatchProps;

export const Command: React.FC<CommandProps> = (props): React.ReactElement => {
	switch (props.currentCommand.status) {
		case (CommandStatus.RUNNING): {
			return (
				<Column>
					<Output {...props.currentCommand}/>
					<Running/>
				</Column>
			);
		}

		case (CommandStatus.INPUT_REQUIRED): {
			return (
				<Column>
					<Output {...props.currentCommand}/>
					<InputPrompt {...props} prompt="⚠️  input required >_"/>
				</Column>
			);
		}

		case (CommandStatus.FINISHED): {
			return (
				<Column>
					<Output {...props.currentCommand}/>
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
	currentCommand: state.commands.current,
	waitForTrigger: !state.app.ci
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
	run: (command: string) => dispatch(runCommand(command)),
	complete: () => dispatch(completed()),
	submit: (input: string) => dispatch(inputReceived(input))
});

export const CurrentCommand = connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Command);
