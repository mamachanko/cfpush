import {isBlank} from './utils';

describe('isBlank', () => {
	describe('when the string is blank', () => {
		it('returns true', () => {
			expect(isBlank(null)).toBe(true);
			expect(isBlank(undefined)).toBe(true);
			expect(isBlank('')).toBe(true);
			expect(isBlank(' ')).toBe(true);
			expect(isBlank('      ')).toBe(true);
		});
	});

	describe('when the string is not blank', () => {
		it('returns false ', () => {
			expect(isBlank('not blank')).toBe(false);
		});
	});
});
