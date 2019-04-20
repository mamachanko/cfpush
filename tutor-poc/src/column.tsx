import * as React from 'react';
import {Box, BoxProps, Static} from 'ink';

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
