export class Api {

    getMessages() {
        console.log("getting messages");
        return fetch("/api/messages?page=0&size=20&sort=timestamp,desc")
            .then(response => {
                if (response.ok) {
                    return response
                        .json()
                        .then(this.#unpackMessages);
                } else {
                    throw new Error(
                        `failed to get messages: ${response.status} / ${response.statusText}`
                    );
                }
            });
    }

    postMessage(message) {
        const body = {text: message};
        console.log(`posting message: ${body}`);
        fetch("/api/messages", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    #unpackMessages = data => data._embedded.messages.map(m => m.text);
};