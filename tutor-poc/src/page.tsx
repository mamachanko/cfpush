import {Box, Color, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {completed, inputReceived, runCommand} from './actions';
import {Column} from './column';
import {Div} from './div';
import {useOnSpace} from './input';
import {InputPrompt} from './input-prompt';
import {Output} from './output';
import {CommandOutput, CommandStatus, FINISHED, INPUT_REQUIRED, RUNNING, State} from './state'; // eslint-disable-line import/named

const CommandPrompt = ({run, waitForTrigger}): React.ReactElement => {
	React.useLayoutEffect(() => {
		if (!waitForTrigger) {
			run();
		}
	}, [waitForTrigger, run]);

	useOnSpace(run);

	return (
		<Column>
			<Text>
				<Color gray>
					{'(press <space> to run)'}
				</Color>
			</Text>
		</Column>
	);
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
			<Text>
				<Color gray>
					{'(press <space> to complete)'}
				</Color>
			</Text>
		</Column>
	);
};

type CommandProps = {
	command: string;
	commandStatus: CommandStatus;
}

const Command: React.FC<CommandProps> = ({command, commandStatus}): React.ReactElement => {
	switch (commandStatus) {
		case (RUNNING): {
			return (
				<Box flexDirection="column" marginY={1}>
					<Text bold>
						<Color yellowBright>
							<Box width={2}>
								<Spinner type="dots"/>
							</Box>
							{command}
						</Color>
					</Text>
				</Box>
			);
		}

		case (INPUT_REQUIRED): {
			return (
				<Box marginY={1}>
					<Text bold>
						<Color rgb={[255, 165, 0]}>
							{`⚠️  ${command}`}
						</Color>
					</Text>
					{' (needs input)'}
				</Box>
			);
		}

		case (FINISHED): {
			return (
				<Box flexDirection="column" marginY={1}>
					<Text bold><Color greenBright>{`✅️  ${command}`}</Color></Text>
				</Box>
			);
		}

		default: {
			return (
				<Box flexDirection="column" marginY={1}>
					<Text bold><Color blueBright>{`>_ ${command}`}</Color></Text>
				</Box>
			);
		}
	}
};

type TitleProps = {
	readonly title?: string;
}

const isBlank = (str: string): boolean => str && str.replace(/\s*/, '') === '';

const Title: React.FC<TitleProps> = ({title}): React.ReactElement =>
	(isBlank(title)) ?
		null :
		<Box marginTop={1}>
			<Text bold>
				<Color bgBlueBright>
					{` ${title} `}
				</Color>
			</Text>
		</Box>;

type StateProps = {
	title?: string;
	text: string;
	command: string;
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
				<Div>
					<Title {...props}/>
					<Text>{props.text}</Text>
					<Output {...props}/>
					<Command {...props}/>
				</Div>
			);
		}

		case (INPUT_REQUIRED): {
			return (
				<Div>
					<Title {...props}/>
					<Text>{props.text}</Text>
					<Output {...props}/>
					<Command {...props}/>
					<InputPrompt {...props} prompt=">_"/>
				</Div>
			);
		}

		case (FINISHED): {
			return (
				<Div>
					<Title {...props}/>
					<Text>{props.text}</Text>
					<Output {...props}/>
					<Command {...props}/>
					<CompletePrompt {...props}/>
				</Div>
			);
		}

		default: {
			return (
				<Div>
					<Title {...props}/>
					<Text>{props.text}</Text>
					<Command {...props}/>
					<CommandPrompt {...props}/>
				</Div>
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
