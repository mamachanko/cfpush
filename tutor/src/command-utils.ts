import {Command} from './state';
import {renderTemplate} from './utils';

const render = (command: Command, context: any): Command =>
	fromString(renderTemplate(toString(command), context));

const toString = (command: Command): string =>
	[command.filename, ...command.args].join(' ');

const fromString = (command: string): Command => {
	const [filename, ...args] = command.split(' ');

	return {filename, args};
};

export const CommandUtils = {
	render,
	toString,
	fromString
};
