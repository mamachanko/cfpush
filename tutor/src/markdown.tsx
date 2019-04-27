import chalk from 'chalk';
import {Text} from 'ink';
import * as Link from 'ink-link';
import * as React from 'react';
import * as matchAll from 'string.prototype.matchall';
import * as terminalLink from 'terminal-link';

export const Markdown: React.FC<{markdown: string}> = ({markdown}): React.ReactElement => (
	<Text>
		{render(markdown)}
	</Text>
);

Markdown.displayName = 'Markdown';

const render = (markdown: string): string =>
	parse(markdown)
		.map(renderMarkdownElement)
		.join('');

export const parse = (markdown: string): MarkdownElement[] => {
	// eslint-disable-next-line unicorn/prefer-spread
	const matches = Array.from(matchAll(markdown, markdownRegex));

	return tokenize(markdown, matches);
};

const markdownRegex = /(\*\*(?<bold>.*?)\*\*|_(?<italic>.*?)_|(?<link>\[(?<name>.*?)\]\((?<url>.*?)\)))/gm;

type MarkdownElement =
	| Plain
	| Bold
	| Italic
	| Link

const PLAIN = 'PLAIN';
type Plain = {
	value: string;
	style: typeof PLAIN;
}

const BOLD = 'BOLD';
type Bold = {
	value: string;
	style: typeof BOLD;
}

const ITALIC = 'ITALIC';
type Italic = {
	value: string;
	style: typeof ITALIC;
}

const LINK = 'LINK';
type Link = {
	name: string;
	url: string;
	style: typeof LINK;
}

export const plain = (value: string): Plain => ({value, style: PLAIN});
export const bold = (value: string): Bold => ({value, style: BOLD});
export const italic = (value: string): Italic => ({value, style: ITALIC});
export const link = (name: string, url: string): Link => ({name, url, style: LINK});

const renderMarkdownElement = (element: MarkdownElement): string => {
	switch (element.style) {
		case (BOLD):
			return chalk.bold(element.value);

		case (ITALIC):
			return chalk.italic(element.value);

		case (LINK):
			return terminalLink(element.name, element.url);

		default:
			return element.value;
	}
};

const tokenize = (text: string, matches = [], token: MarkdownElement[] = []): MarkdownElement[] => {
	if (matches.length === 0) {
		return [...token, plain(text)];
	}

	const [currentMatch, ...nextMatches] = matches;

	const head = text.substr(0, text.indexOf(currentMatch[0]));
	const remainingText = text.substr(text.indexOf(currentMatch[0]) + Number(currentMatch[0].length));

	return tokenize(remainingText, nextMatches, [...token, plain(head), parseMatch(currentMatch)]);
};

const parseMatch = (match): MarkdownElement => {
	const {bold: bold_, italic: italic_, link: link_, name, url} = match.groups;

	if (bold_) {
		return bold(bold_);
	}

	if (italic_) {
		return italic(italic_);
	}

	if (link_) {
		return link(name, url);
	}

	throw new Error(`unexpected match ${JSON.stringify(match)}`);
};
