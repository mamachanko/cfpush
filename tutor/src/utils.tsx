
export const isBlank = (str: string): boolean => {
	if (str == undefined) { // eslint-disable-line eqeqeq
		return true;
	}

	return str.replace(/\s*/, '') === '';
};
