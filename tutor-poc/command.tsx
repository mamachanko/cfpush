import {Box, StdinContext, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {runCommand, inputReceived} from './actions';
import {log} from './logging';
import {State} from './reducer';

const SPACE = 'space';
const ENTER = 'return';

interface Key {
	name: string;
}

type InputHandler = (character: string, key: Key) => void;

const logKeypress: InputHandler = (ch, key): void => log(`keypress: ch='${ch}', key=${JSON.stringify(key)}`);

const useStdin = (handleInput: InputHandler): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	React.useLayoutEffect(() => {
		setRawMode(true);
		stdin.on('keypress', handleInput);
		stdin.on('keypress', logKeypress);

		return () => {
			stdin.removeAllListeners('keypress');
			setRawMode(false);
		};
	}, [setRawMode, stdin, handleInput]);
};

const CommandTrigger = ({command, run}): React.ReactElement => {
	const handleInput: InputHandler = (_, key): void => {
		if (key.name === SPACE) {
			run();
		}
	};

	useStdin(handleInput);

	if (process.env.CI === 'true') {
		run();
	}

	return <Text>{`press <space> to run "${command}"`}</Text>;
};

CommandTrigger.propTypes = {
	command: PropTypes.string.isRequired
};

const CommandPrompt = ({command, run, submitInput, running, inputRequired}): React.ReactElement => {
	if (running && !inputRequired) {
		return (
			<Box>
				<Box width={2}>
					<Spinner type="dots"/>
				</Box>
				<Text>running</Text>
			</Box>
		);
	}

	if (inputRequired) {
		return <InputPrompt submitInput={submitInput}/>;
	}

	return <CommandTrigger command={command} run={run}/>;
};

CommandPrompt.propTypes = {
	command: PropTypes.string.isRequired
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
		<Box flexDirection="column">
			<Text>⚠️ input required</Text>
			<Text>{'>_ ' + userInput}</Text>
		</Box>
	);
};

const ExitStatus = (): React.ReactElement => <Text>✅ finished</Text>;

const Output = ({output}): React.ReactElement => {
	const outputLine = (text: string): React.ReactElement =>
		<Text key={text + String(Date.now())}>{text}</Text>;

	if (output && output.length > 0) {
		return (
			<Box flexDirection="column">
				<Box flexDirection="column">
					{output.map(outputLine)}
				</Box>
			</Box>
		);
	}

	return <Text>no command output</Text>;
};

type OwnProps = {
	command: string;
}

type StateProps = {
	running: boolean;
	finished: boolean;
	inputRequired: boolean;
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

export const Command: React.FC<CommandProps> = ({command, run, submitInput, running, inputRequired, finished, output}): React.ReactElement => (
	<Box flexDirection="column">
		{running || finished ? <Output output={output}/> : null}
		{finished ? <ExitStatus/> : <CommandPrompt running={running} inputRequired={inputRequired} command={command} run={run} submitInput={submitInput}/>}
	</Box>
);

Command.propTypes = {
	command: PropTypes.string.isRequired
};

const mapStateToProps = (state: State): StateProps => ({
	running: state.running,
	finished: state.finished,
	inputRequired: state.inputRequired,
	output: state.output
});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: OwnProps): DispatchProps => ({
	run: () => dispatch(runCommand(ownProps.command)),
	submitInput: (input: string) => dispatch(inputReceived(input))
});

export const ConnectedCommand = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(Command);
