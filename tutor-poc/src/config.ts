import {Page} from './state';

export const Tutorial = 'TUTORIAL';
export const Dry = 'DRY';
export const Ci = 'CI';
export type Mode =
	| typeof Tutorial
	| typeof Dry
	| typeof Ci;

export interface Config {
	mode: Mode;
	pages: ReadonlyArray<Page>;
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

const cfCiLogin = (): string => ['cf', 'login', '-a', 'api.run.pivotal.io', '-u', process.env.CF_USERNAME, '-p', process.env.CF_PASSWORD, '-o', process.env.CF_ORG, '-s', process.env.CF_SPACE]
	.join(' ');

const parsePages = (pages: ReadonlyArray<Page>, mode: Mode): ReadonlyArray<Page> => {
	switch (mode) {
		case (Ci): return pages.map(page => page.command.match(/cf\s+login/) ? {...page, command: cfCiLogin()} : page);
		case (Dry):
		case (Tutorial):
		default: return pages;
	}
};

export const parseConfig = (commands: ReadonlyArray<Page>, env: any): Config => {
	const mode = parseMode(env);
	return {
		mode,
		pages: parsePages(commands, mode)
	};
};
