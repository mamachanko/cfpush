import {createCfContextMiddleware} from './cf-context-middleware';
import {createCommandRuntimeMiddleware} from './command-runtime-middleware';
import {loggingMiddleware} from './logging-middleware';
import {Middleware} from './middleware';
import {Command, Page, State, CurrentCommand, UNSTARTED} from './state';
import {createDryMiddleware} from './dry-middleware';

export const parse = (pages: Page<Command>[], env: any): Config => {
	const mode = parseMode(env);
	return ({
		initialState: createInitialState(pages, mode),
		middleware: createMiddleware(mode)
	});
};

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

const Tutorial = 'TUTORIAL';
const Dry = 'DRY';
const Ci = 'CI';
type Mode =
	| typeof Tutorial
	| typeof Dry
	| typeof Ci;

const createInitialState = (pages: Page<Command>[], mode: Mode): State => {
	if (mode === Ci) {
		pages = pages.map(page => isCfLogin(page.command) ? {...page, command: cfCiLogin()} : page);
	}

	const [firstPage, ...nextPages] = pages;

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
