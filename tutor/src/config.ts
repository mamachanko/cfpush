import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {createCfContextMiddleware} from './cf-context-middleware';
import {createCommandRuntimeMiddleware} from './command-runtime-middleware';
import {createDryMiddleware} from './dry-middleware';
import {loggingMiddleware} from './logging-middleware';
import {Middleware} from './middleware';
import {Command, CurrentCommand, Page, State, UNSTARTED} from './state';

export const parse = (configFile: string, env: any): Config => {
	const pages = parsePages(configFile);
	const mode = parseMode(env);
	return createConfig(pages, mode);
};

export type PageConfig = Page<Command> & MaybeCi;

type MaybeCi = {
	ci?: boolean;
}

export type Config = {
	initialState: State;
	middleware: Middleware[];
}

export const defaultMiddleware = [
	createCommandRuntimeMiddleware(),
	createCfContextMiddleware(),
	loggingMiddleware
];

export const dryMiddleware = [
	createDryMiddleware(),
	loggingMiddleware
];

const parsePages = (filename: string): PageConfig[] => {
	return yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
};

const parseMode = (env: any): Mode => {
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

export const createConfig = (pages: PageConfig[], mode: Mode): Config => ({
	initialState: createInitialState(pages, mode),
	middleware: createMiddleware(mode)
});

export const Tutorial = 'TUTORIAL';
export const Dry = 'DRY';
export const Ci = 'CI';
type Mode =
	| typeof Tutorial
	| typeof Dry
	| typeof Ci;

const createInitialState = (pages: PageConfig[], mode: Mode): State => {
	const [firstPage, ...nextPages] = pages
		.map(page => (mode === Ci && isCfLogin(page.command)) ? {...page, command: cfCiLogin()} : page)
		.filter(page => mode === Ci || !page.ci)
		.map(dropCi);

	const currentPage = firstPage.command ? {
		...firstPage,
		command: {
			...firstPage.command,
			status: UNSTARTED,
			stdout: []
		}
	} : firstPage;

	return ({
		app: {
			waitForTrigger: mode !== Ci,
			pinOutput: mode === Ci,
			exit: false
		},
		cloudFoundryContext: {},
		pages: {
			completed: [],
			current: (currentPage as Page<CurrentCommand>),
			next: nextPages
		}
	});
};

const dropCi = (page: PageConfig): Page<Command> => {
	const {ci, ...rest} = page;
	return rest;
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

const createMiddleware = (mode: Mode): Middleware[] => mode === Dry ? dryMiddleware : defaultMiddleware;
