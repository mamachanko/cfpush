import {Page, Command} from './state'; // eslint-disable-line import/named
import {CommandUtils} from './command-utils';

export const Tutorial = 'TUTORIAL';
export const Dry = 'DRY';
export const Ci = 'CI';
export type Mode =
	| typeof Tutorial
	| typeof Dry
	| typeof Ci;

export type PageConfig = {
	title?: string;
	subtitle?: string;
	text: string;
	command?: string;
}

export type Config = {
	mode: Mode;
	pages: Page<Command>[];
}

export const parseMode = (env: any): Mode => {
	const ci = env.CI === 'true';
	const dry = env.DRY === 'true';

	switch (`${ci} ${dry}`) {
		case ('true false'):
		case ('true true'):
			return Ci;
		case ('false true'):
			return Dry;
		default:
			return Tutorial;
	}
};

const cfCiLogin = (): Command => ({
	filename: 'cf',
	args: ['login', '-a', 'api.run.pivotal.io', '-u', process.env.CF_USERNAME, '-p', process.env.CF_PASSWORD, '-o', process.env.CF_ORG, '-s', process.env.CF_SPACE]
});

const isCfLogin = (command?: Command): boolean => Boolean(
	command &&
	command.filename === 'cf' &&
	command.args[0] === 'login'
);

const parseCommand = (page: PageConfig): Page<Command> => {
	if (page.command == null) { // eslint-disable-line no-eq-null, eqeqeq
		return page as Page<null>;
	}

	return {
		...page,
		command: CommandUtils.fromString(page.command)
	};
};

const parsePages = (pages: PageConfig[], mode: Mode): Page<Command>[] => {
	const parsedPages = pages.map(parseCommand);
	switch (mode) {
		case (Ci):
			return parsedPages.map(page => isCfLogin(page.command) ? {...page, command: cfCiLogin()} : page);
		case (Dry):
		case (Tutorial):
		default:
			return parsedPages;
	}
};

export const parseConfig = (pages: PageConfig[], env: any): Config => {
	const mode = parseMode(env);
	return {
		mode,
		pages: parsePages(pages, mode)
	};
};
