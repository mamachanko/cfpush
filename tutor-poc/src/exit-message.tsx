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
			Was there a problem?
			</Box>
			<Box>
			Reach out at <Link url="github.com/mamachanko/cfpush/issues">github.com/mamachanko/cfpush/issues</Link>
			</Box>
		</Box>
		<Box marginY={1} textWrap="wrap" width="80">
		You might want to decommission the <Text italic>cfpush-tutorial</Text> space to not further incur cost against your quota. 💵
		</Box>
		<Box marginY={1}>See you! 👋🏽</Box>
	</Div>

);
