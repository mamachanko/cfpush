import * as React from 'react';
import {Text} from 'ink';
import {Column} from './column';

export const ExitMessage = (): React.ReactElement => (
	<Column>
		<Text>ok.</Text>
		<Text>bye.</Text>
	</Column>
);
