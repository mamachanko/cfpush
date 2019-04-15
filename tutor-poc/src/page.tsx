import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {completed, inputReceived, runCommand} from './actions';
import {Column} from './column';
import {useOnSpace} from './input';
import {InputPrompt} from './input-prompt';
import {Output} from './output';
import {FINISHED, INPUT_REQUIRED, RUNNING, State, CommandStatus, CommandOutput} from './state'; // eslint-disable-line import/named

const CommandTrigger = ({command, run, waitForTrigger}): React.ReactElement => {
	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			run();
		}
	}, [waitForTrigger, run]);

	useOnSpace(run);

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
	command: string;
	text: string;
	commandStatus: CommandStatus;
	output: ReadonlyArray<CommandOutput>;
	waitForTrigger: boolean;
};

type DispatchProps = {
	run: (command: string) => void;
	complete: () => void;
	submit: (input: string) => void;
}

export type PageProps =
	& StateProps
	& DispatchProps;

export const Page: React.FC<PageProps> = (props): React.ReactElement => {
	switch (props.commandStatus) {
		case (RUNNING): {
			return (
				<Column>
					<Output {...props}/>
					<Running/>
				</Column>
			);
		}

		case (INPUT_REQUIRED): {
			return (
				<Column>
					<Output {...props}/>
					<InputPrompt {...props} prompt="⚠️  input required >_"/>
				</Column>
			);
		}

		case (FINISHED): {
			return (
				<Column>
					<Output {...props}/>
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

const mapStateToProps = (state: State): StateProps => ({
	...state.pages.current,
	waitForTrigger: state.app.waitForTrigger
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
	run: () => dispatch(runCommand()),
	complete: () => dispatch(completed()),
	submit: (input: string) => dispatch(inputReceived(input))
});

export const CurrentPage = connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Page);
