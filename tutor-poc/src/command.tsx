import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {completed, inputReceived, runCommand} from './actions';
import {Column} from './column';
import * as CommandStatus from './command-status';
import {Output} from './output';
import * as reducer from './reducer';
import {InputHandler, Key, SPACE, useStdin} from './use-stdin'; // eslint-disable-line import/named
import {InputPrompt} from './input-prompt';

const CommandTrigger = ({command, run, waitForTrigger}): React.ReactElement => {
	const handleInput: InputHandler = (_, key): void => {
		if (key.name === SPACE) {
			run(command);
		}
	};

	useStdin(handleInput);

	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			run();
		}
	}, [waitForTrigger, run]);

	return <Text>{`press <space> to run "${command.command}"`}</Text>;
};

const CompletePrompt = ({complete, waitForTrigger}): React.ReactElement => {
	const handleInput: InputHandler = (_: string, key: Key): void => {
		if (key.name === SPACE) {
			complete();
		}
	};

	useStdin(handleInput);

	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			complete();
		}
	}, [waitForTrigger, complete]);

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
	submitInput: (input: string) => void;
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
	submitInput: (input: string) => dispatch(inputReceived(input))
});

export const CurrentCommand = connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Command);
