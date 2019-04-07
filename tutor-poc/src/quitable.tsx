import {AppContext} from 'ink';
import * as React from 'react';
import {Key, useStdin} from './use-stdin';

type QuitableProps = {
	exitDisplay: React.ReactElement;
};

export const Quitable: React.FC<QuitableProps> = ({children, exitDisplay}): React.ReactElement => {
	const {exit} = React.useContext(AppContext);
	const [show, setShow] = React.useState(true);

	useStdin((_: string, key: Key) => {
		if (key.name === 'q') {
			setShow(false);
			exit();
		}
	});

	return show ? <>{children}</> : exitDisplay;
};
