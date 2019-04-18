import * as Mustache from 'mustache';
import {Command} from './state'; // eslint-disable-line import/named

const render = (command: Command, context: any): Command =>
	fromString(Mustache.render(toString(command), context));

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
