import {Box, BoxProps} from 'ink';
import * as React from 'react';

export const Column: React.FC<BoxProps> = (props): React.ReactElement => {
	const boxProps = {
		...props,
		flexDirection: 'column',
		textWrap: 'wrap',
		width: 70
	};
	return (
		<Box {...boxProps as BoxProps}>
			{boxProps.children}
		</Box>
	);
};
