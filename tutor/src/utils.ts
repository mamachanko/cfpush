import * as path from 'path';
import * as Mustache from 'mustache';

export const isBlank = (str: string): boolean => {
	if (str == undefined) { // eslint-disable-line eqeqeq
		return true;
	}

	return str.replace(/\s*/, '') === '';
};

export const REPOSITORY_ROOT = path.resolve(__dirname, '..', '..');

export const renderTemplate = (template: string, context: any): string => Mustache.render(template, context);
