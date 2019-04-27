import {renderTemplate} from './utils';
import {Page, UNSTARTED} from './state';
import {CommandUtils} from './command-utils';

export const renderPage = (page: Page, context: any): Page => ({
	...page,
	body: renderTemplate(page.body, context),
	...(
		page.command ?
			{
				command: {...CommandUtils.render(page.command, context),
					status: UNSTARTED,
					stdout: []}
			} : {}
	)
});
