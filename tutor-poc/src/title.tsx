import * as React from 'react';
import {Color, Text, Box} from 'ink';
import * as BorderedBox from 'ink-box';

export const Title = (): React.ReactElement => (
	<Box
		flexDirection="column"
		textWrap="wrap"
		paddingBottom={2}
		width={80}
	>
		<BorderedBox padding={1}>
			<Text>Welcome to <Color blue bgWhite> cfpush </Color> !</Text>
		</BorderedBox>
		<Box marginTop={1}>
			{'An interactive Cloud Foundry tutorial in your terminal'}
		</Box>
		<Box marginTop={1}>
			{'We will be exploring $(bold \'Cloud Foundry\') and cloud-native computing by deploying a real chat application to Cloud Foundry.'}
		</Box>
		<Box marginTop={1}>
			{'Are you ready? We can\'t wait. Let\'s go!'}
		</Box>
		<Box marginTop={1}>
			{'press <enter> to start'}
		</Box>
	</Box>
);
