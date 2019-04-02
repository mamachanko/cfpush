import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {inputReceived, runCommand} from './actions';
import {CommandStatus, State} from './reducer'; // eslint-disable-line import/named
import {InputHandler, useStdin, Key, SPACE, ENTER} from './use-stdin'; // eslint-disable-line import/named
import {Column} from './column';

const CommandTrigger = ({command, run, waitForTrigger}): React.ReactElement => {
	const handleInput: InputHandler = (_, key): void => {
		if (key.name === SPACE) {
			run();
		}
	};

	useStdin(handleInput);

	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			run();
		}
	}, [waitForTrigger, run]);

	return <Text>{`press <space> to run "${command}"`}</Text>;
};

const InputPrompt = ({submitInput}): React.ReactElement => {
	const [userInput, setUserInput] = React.useState('');

	const handleInput: InputHandler = (ch: string, key: Key): void => {
		if (key.name === ENTER) {
			submitInput(userInput);
		} else {
			setUserInput(prevUserInput => prevUserInput + ch);
		}
	};

	useStdin(handleInput);

	return (
		<Column>
			<Text>⚠️ input required</Text>
			<Text>{'>_ ' + userInput}</Text>
		</Column>
	);
};

const Output = ({output}): React.ReactElement => {
	const outputLine = (text: string): React.ReactElement =>
		<Text key={text + String(Date.now())}>{text}</Text>;

	if (output && output.length > 0) {
		return (
			<Column>
				{output.map(outputLine)}
			</Column>
		);
	}

	return <Text>no command output</Text>;
};

const Running: React.FC = (): React.ReactElement => (
	<Box>
		<Box width={2}>
			<Spinner type="dots"/>
		</Box>
		<Text>running</Text>
	</Box>
);

type OwnProps = {
	command: string;
}

type StateProps = {
	waitForTrigger: boolean;
	status: CommandStatus;
	output: ReadonlyArray<string>;
};

type DispatchProps = {
	run: () => void;
	submitInput: (input: string) => void;
}

export type CommandProps =
	& StateProps
	& DispatchProps
	& OwnProps;

export const Command: React.FC<CommandProps> = (props): React.ReactElement => {
	switch (props.status) {
		case ('RUNNING'): {
			return (
				<Column>
					<Output {...props}/>
					<Running/>
				</Column>
			);
		}

		case ('INPUT_REQUIRED'): {
			return (
				<Column>
					<Output {...props}/>
					<InputPrompt {...props}/>
				</Column>
			);
		}

		case ('FINISHED'): {
			return (
				<Column>
					<Output {...props}/>
					<Text>✅ finished</Text>
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

const mapStateToProps = (state: State): StateProps => ({
	waitForTrigger: state.waitForTrigger,
	status: state.status,
	output: state.output
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: OwnProps): DispatchProps => ({
	run: () => dispatch(runCommand(ownProps.command)),
	submitInput: (input: string) => dispatch(inputReceived(input))
});

export const ConnectedCommand = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(Command);
