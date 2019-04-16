import {Box, Color, Text} from 'ink';
import * as React from 'react';
import {Div} from './div';

export const Title = (): React.ReactElement => (
	<Div>
		<Box marginY={1}>
			<Text bold>
				{'Welcome to '}
				<Color white bgBlue>
					{' cfpush ☁️  '}
				</Color>
			</Text>
		</Box>
		<Box marginBottom={1}>
			<Text italic>An interactive Cloud Foundry tutorial in your terminal</Text>
		</Box>
		<Box marginBottom={1} width={70} textWrap="wrap">
			We will be exploring <Text bold>Cloud Foundry</Text> and cloud-native computing by deploying a real chat application to Cloud Foundry.
		</Box>
	</Div>
);
