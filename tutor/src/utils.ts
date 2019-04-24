import * as path from 'path';

export const isBlank = (str: string): boolean => {
	if (str == undefined) { // eslint-disable-line eqeqeq
		return true;
	}

	return str.replace(/\s*/, '') === '';
};

export const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');
