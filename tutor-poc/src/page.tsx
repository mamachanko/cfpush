import {Box, Color, Text} from 'ink';
import Spinner from 'ink-spinner';
import * as React from 'react';
import {connect} from 'react-redux';
import * as Redux from 'redux';
import {completed, inputReceived, runCommand} from './actions';
import {Column} from './column';
import {useOnSpace} from './input';
import {InputPrompt} from './input-prompt';
import {CurrentCommand, FINISHED, INPUT_REQUIRED, RUNNING, State} from './state'; // eslint-disable-line import/named
import {Stdout} from './stdout';
import {isBlank} from './utils';

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
					{'(press <space> to continue)'}
				</Color>
			</Text>
		</Column>
	);
};

type CommandProps = CurrentCommand;

const Command: React.FC<CommandProps> = ({command, status}): React.ReactElement => {
	switch (status) {
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

type SubtitleProps = {
	readonly subtitle?: string;
};

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

const Subtitle: React.FC<SubtitleProps> = ({subtitle}): React.ReactElement =>
	(isBlank(subtitle)) ?
		null :
		<Box marginTop={1}>
			<Text italic>
				{`~ ${subtitle} ~`}
			</Text>
		</Box>;

type PageContentProps = {
	readonly title?: string;
	readonly subtitle?: string;
	readonly text: string;
}

const StaticContent: React.FC<PageContentProps> = ({title, subtitle, text}): React.ReactElement => (
	<Column marginLeft={0}>
		<Box
			flexDirection="column"
			alignItems="center"
		>
			<Title title={title}/>
			<Subtitle subtitle={subtitle}/>
		</Box>
		<Text>{text}</Text>
	</Column>
);

type StaticPageProps = {
	title?: string;
	subtitle?: string;
	text: string;
	waitForTrigger: boolean;
	complete: () => void;
}

const StaticPage: React.FC<StaticPageProps> = (props): React.ReactElement => (
	<>
		<StaticContent {...props}/>
		<CompletePrompt {...props}/>
	</>
);

type CommandPageProps = PageProps;

const CommandPage: React.FC<CommandPageProps> = (props): React.ReactElement => {
	switch (props.command.status) {
		case (RUNNING): {
			return (
				<Column marginLeft={4}>
					<StaticContent {...props}/>
					<Stdout {...props.command}/>
					<Command {...props.command}/>
				</Column>
			);
		}

		case (INPUT_REQUIRED): {
			return (
				<Column marginLeft={4}>
					<StaticContent {...props}/>
					<Stdout {...props.command}/>
					<Command {...props.command}/>
					<InputPrompt {...props} prompt=">_"/>
				</Column>
			);
		}

		case (FINISHED): {
			return (
				<Column marginLeft={4}>
					<StaticContent {...props}/>
					<Stdout {...props.command}/>
					<Command {...props.command}/>
					<CompletePrompt {...props}/>
				</Column>
			);
		}

		default: {
			return (
				<Column marginLeft={4}>
					<StaticContent {...props}/>
					<Command {...props.command}/>
					<CommandPrompt {...props}/>
				</Column>
			);
		}
	}
};

type StateProps = {
	title?: string;
	subtitle?: string;
	text: string;
	command?: CurrentCommand;
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

export const Page: React.FC<PageProps> = (props): React.ReactElement => (
	<Column marginLeft={4}>
		{props.command ?
			<CommandPage {...props}/> :
			<StaticPage {...props}/>}
	</Column>
);

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
