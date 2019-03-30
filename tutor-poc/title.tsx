import * as React from 'react';
import {Color} from 'ink';
import * as Box from 'ink-box';

export const Title = (): React.ReactElement => (
	<Box
		borderStyle="round"
		borderColor="cyan"
	>
		Welcome to <Color green>cfpush</Color>
	</Box>
);
