export const Api = {

    getMessages: () => {
        return fetch("/api/messages")
            .then(response => {
                if (response.ok) {
                    response.json();
                } else {
                    throw new Error(
                        `failed to load messages: ${response.status} / ${response.statusText}`
                    );
                }
            });
    }

};