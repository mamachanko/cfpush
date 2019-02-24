export class Api {

    constructor(getTimestamp) {
        this.getTimestamp = getTimestamp;
    }

    getMessages() {
        console.log("getting messages");
        return fetch("/api/messages")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(
                        `failed to load messages: ${response.status} / ${response.statusText}`
                    );
                }
            });
    }

    postMessage(message) {
        const body = JSON.stringify({
            text: message,
            timestamp: this.getTimestamp()
        });
        console.log(`posting message: ${body}`);
        return fetch("/api/messages", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        }).then(response => response.json())
    }
};