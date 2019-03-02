import {Api} from "./Api";

describe('Api', () => {

    beforeEach(() => {
        fetch.resetMocks();
    });

    describe('getMessages', () => {

        describe.each([[[
            'nice to meet you Chad',
            'my name is Chad',
            'what\'s your name?',
        ]], [[
            'test-message-3',
            'test-message-2',
            'test-message-1',
        ]]])('when the API successfully responds with %s', expectedMessages => {

            it('returns messages', async () => {
                fetch.mockResponseOnce(JSON.stringify({
                    _embedded: {
                        messages: expectedMessages.map(text => ({text}))
                    }
                }));

                const messages = await new Api().getMessages();

                expect(messages).toEqual(expectedMessages);
                expect(fetch).toHaveBeenCalledTimes(1);
                expect(fetch).toHaveBeenCalledWith("/api/messages?page=0&size=20&sort=timestamp,desc");
            });

        });

        describe('when the API returns an error', () => {

            it('throws', () => {
                fetch.mockReject(new Error('get-messages-test-error'));

                const api = new Api();

                expect(api.getMessages()).rejects.toThrow;
                expect(fetch).toHaveBeenCalledTimes(1);
                expect(fetch).toHaveBeenCalledWith("/api/messages?page=0&size=20&sort=timestamp,desc");
            })

        });

    });

    describe('postMessage', () => {

        it.each([
            'hi!',
            'hello',
            '-> test-message *'
        ])('posts message "%s"', (message) => {
            const api = new Api();

            api.postMessage(message);

            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith("/api/messages", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text: message})
            });
        });

    });
});