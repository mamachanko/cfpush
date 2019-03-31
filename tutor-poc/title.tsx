import {Box, Text} from 'ink';
import * as React from 'react';
import {qrcode} from './qrcode';

export const Title = (): React.ReactElement => {
	return (
		<Box flexDirection="column">
			<Text>point your phone📱here ↓</Text>
			<Text>{qrcode('https://cfpush.cloud')}</Text>
		</Box>
	);
};
