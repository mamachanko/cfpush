import {Box, StdinContext, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {ReactReduxContext} from 'react-redux';
import {runCommand} from './actions';

const SPACE = ' ';
const ENTER = '\r';

const useStdin = (handleInput: (input: string) => void): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	React.useEffect(() => {
		setRawMode(true);
		stdin.on('data', handleInput);

		return () => {
			stdin.removeListener('data', handleInput);
			setRawMode(false);
		};
	}, [stdin, setRawMode, handleInput]);
};

const Trigger = ({command}): React.ReactElement => {
	const {store: {dispatch}} = React.useContext(ReactReduxContext);

	const start = React.useCallback(
		() => dispatch(runCommand(command)),
		[command, dispatch]
	);
	const handleInput = (input: string): void => {
		if (input === SPACE) {
			start();
		}
	};

	useStdin(handleInput);

	return <Text>{`press <space> to run "${command}"`}</Text>;
};

Trigger.propTypes = {
	command: PropTypes.string.isRequired
};

const CommandPrompt = ({command}): React.ReactElement => {
	const {store} = React.useContext(ReactReduxContext);
	const {running} = store.getState();

	if (running) {
		return (
			<Box>
				<Box width={2}>
					<Spinner type="dots"/>
				</Box>
				<Text>running</Text>
			</Box>
		);
	}

	return <Trigger command={command}/>;
};

CommandPrompt.propTypes = {
	command: PropTypes.string.isRequired
};

const InputPrompt = (): React.ReactElement => {
	const {store: {dispatch}} = React.useContext(ReactReduxContext);
	const [userInput, setUserInput] = React.useState('');
	const submit = React.useCallback(
		() => {
			setUserInput('');
			dispatch({type: 'INPUT_RECEIVED', input: userInput});
		},
		[dispatch, userInput]
	);

	const handleInput = (input: string): void => {
		if (input === ENTER) {
			submit();
		} else {
			setUserInput((prevUserInput: string) => prevUserInput + input);
		}
	};

	useStdin(handleInput);

	return (
		<Box>
			<Text>{'>_ '}</Text>
			<Text>{userInput}</Text>
		</Box>
	);
};

const ExitStatus = (): React.ReactElement => {
	const {store} = React.useContext(ReactReduxContext);
	const {finished, exitCode} = store.getState();

	if (finished) {
		return <Text>{`finished w/ ${exitCode}`}</Text>;
	}

	return null;
};

const Output = (): React.ReactElement => {
	const {store} = React.useContext(ReactReduxContext);
	const {output} = store.getState();

	const outputLine = (text: string): React.ReactElement =>
		<Text key={text + String(Date.now())}>{text}</Text>;

	if (output && output.length > 0) {
		return (
			<Box flexDirection="column">
				<Text>output:</Text>
				<Box flexDirection="column">
					{output.map(outputLine)}
				</Box>
			</Box>
		);
	}

	return null;
};

export const Command = ({command}): React.ReactElement => {
	const {store: {getState}} = React.useContext(ReactReduxContext);
	const {inputRequired} = getState();

	return (
		<Box flexDirection="column">
			<Output/>
			{inputRequired ? <InputPrompt/> : null}
			<ExitStatus/>
			<CommandPrompt command={command}/>
		</Box>
	);
};

Command.propTypes = {
	command: PropTypes.string.isRequired
};
