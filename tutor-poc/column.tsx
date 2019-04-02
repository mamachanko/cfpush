import * as React from 'react';
import {Box} from 'ink';

export const Column: React.FC = ({children}): React.ReactElement => <Box flexDirection="column">{children}</Box>;
