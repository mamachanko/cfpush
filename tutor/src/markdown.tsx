import {Box, Text, BoxProps} from 'ink';
import * as Link from 'ink-link';
import * as React from 'react';
import * as matchAll from 'string.prototype.matchall';

export const Markdown: React.FC<{markdown: string} & BoxProps> = ({markdown, ...boxProps}): React.ReactElement => (
	/* eslint-disable react/no-array-index-key */
	<Box {...{...boxProps, flexDirection: 'column'}}>
		{markdown
			.split('\n\n')
			.map(paragraph => paragraph.trim())
			.filter(paragraph => paragraph !== '')
			.map((paragraph, index, paragraphs) => (
				<Box key={index} marginBottom={(index + 1 < paragraphs.length) ? 1 : 0}>
					{parseMarkdown(paragraph)
						.map(renderMarkdownElement)
						.map((element, key) => React.cloneElement(element, {key}))}
				</Box>
			))}
	</Box>
	/* eslint-enable react/no-array-index-key */
);

Markdown.displayName = 'Markdown';

export const parseMarkdown = (markdown: string): MarkdownElement[] => {
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

const renderMarkdownElement = (element: MarkdownElement): React.ReactElement => {
	switch (element.style) {
		case (BOLD):
			return <Text bold>{element.value}</Text>;

		case (ITALIC):
			return <Text italic>{element.value}</Text>;

		case (LINK):
			return <Link url={element.url}>{element.name}</Link>;

		default:
			return <Text>{element.value}</Text>;
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
