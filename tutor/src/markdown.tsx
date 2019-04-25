import * as React from 'react';
import * as matchAll from 'string.prototype.matchall';
import {Box, Text} from 'ink';
import * as Link from 'ink-link';

export const Markdown: React.FC<{markdown: string}> = ({markdown}): React.ReactElement => (
	<Box width="100%" textWrap="wrap">
		{renderMarkdown(markdown)}
	</Box>
);

Markdown.displayName = 'Markdown';

const renderMarkdown = (markdown: string): React.ReactElement[] => {
	// eslint-disable-next-line unicorn/prefer-spread
	const matches = Array.from(matchAll(markdown, markdownRegex));

	// eslint-disable-next-line react/no-array-index-key
	return render(markdown, matches).map((element, key) => React.cloneElement(element, {key}));
};

const markdownRegex = /(\*\*(?<bold>.*?)\*\*|_(?<italic>.*?)_|(?<link>\[(?<name>.*?)\]\((?<url>.*?)\)))/gm;

const render = (text: string, matches = [], result: React.ReactElement[] = []): React.ReactElement[] => {
	if (matches.length === 0) {
		return [...result, plainText(text)];
	}

	const [currentMatch, ...nextMatches] = matches;
	const [head, remainingText] = text.split(currentMatch[0]);

	const element = renderElement(currentMatch);

	return render(remainingText, nextMatches, [...result, plainText(head), element]);
};

const plainText = (text: string): React.ReactElement => <Text>{text}</Text>;

const renderElement = (match): React.ReactElement => {
	const {bold, italic, link, name, url} = match.groups;

	if (bold) {
		return <Text bold>{bold}</Text>;
	}

	if (italic) {
		return <Text italic>{italic}</Text>;
	}

	if (link) {
		return <Link url={url}>{name}</Link>;
	}

	throw new Error(`unexpected match ${match}`);
};

