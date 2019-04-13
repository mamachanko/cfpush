export const Tutorial = 'TUTORIAL';
export const Dry = 'DRY';
export const Ci = 'CI';
export type Mode =
	| typeof Tutorial
	| typeof Dry
	| typeof Ci;

export interface Config {
	mode: Mode;
	commands: ReadonlyArray<string>;
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

export const parseCommands = (commands: ReadonlyArray<string>, mode: Mode): ReadonlyArray<string> => {
	switch (mode) {
		case (Ci): return commands.map(command => command.match(/cf\s+login/) ? cfCiLogin() : command);
		case (Dry):
		case (Tutorial):
		default: return commands;
	}
};

export const parseConfig = (commands: ReadonlyArray<string>, env: any): Config => {
	const mode = parseMode(env);
	return {
		mode,
		commands: parseCommands(commands, mode)
	};
};
