import {Box, Color, Text} from 'ink';
import * as Link from 'ink-link';
import * as React from 'react';
import {Div} from './div';

export const ExitMessage = (): React.ReactElement => (
	<Div>
		<Box marginY={1}>
			<Color black bgRed>
				{' Oh, I am slain... 💀 '}
			</Color>
		</Box>
		<Box marginY={1} flexDirection="column">
			<Box flexGrow={1}>
				You have quit the app. Was there a problem?
			</Box>
			<Box>
				If so, reach out at <Link url="github.com/mamachanko/cfpush/issues">github.com/mamachanko/cfpush/issues</Link>
			</Box>
		</Box>
		<Box marginY={1} textWrap="wrap" width="80">
			You might want to decommission the <Text italic>cfpush-tutorial</Text> space to not further incur cost against your quota. 💵 The command for that is:
		</Box>
		<Box marginY={1}>
			<Text bold>cf delete-space -f cfpush-tutorial</Text>
		</Box>
		<Box marginY={1}>See you! 👋🏽</Box>
	</Div>
);
