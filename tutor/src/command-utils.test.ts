import {CommandUtils} from './command-utils';

describe('Command utils', () => {
	describe('renderCommand', () => {
		it('renders command', () => {
			expect(CommandUtils.render(
				{filename: '', args: []},
				{}
			)).toStrictEqual(
				{filename: '', args: []}
			);

			expect(CommandUtils.render(
				{filename: 'some', args: ['command']},
				{}
			)).toStrictEqual(
				{filename: 'some', args: ['command']}
			);

			expect(CommandUtils.render(
				{filename: 'command', args: ['with', 'an', '{{placeholder}}']},
				{placeholder: 'argument'}
			)).toStrictEqual(
				{filename: 'command', args: ['with', 'an', 'argument']}
			);

			expect(CommandUtils.render(
				{filename: 'command', args: ['with', 'an', '{{placeholder}}']},
				{anotherPlaceholder: 'another argument'}
			)).toStrictEqual(
				{filename: 'command', args: ['with', 'an', '']}
			);
		});
	});
});
