import {Box, BoxProps} from 'ink';
import * as React from 'react';

export const Div: React.FC<{}> = ({children}): React.ReactElement => {
	const boxProps: BoxProps = {
		flexDirection: 'column',
		textWrap: 'wrap',
		width: 70,
		marginLeft: 4
	};
	return (
		<Box {...boxProps}>
			{children}
		</Box>
	);
};
