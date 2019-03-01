export class Api {

    getMessages() {
        console.log("getting messages");
        return fetch("/api/messages?page=0&size=10&sort=timestamp,desc")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(
                        `failed to get messages: ${response.status} / ${response.statusText}`
                    );
                }
            });
    }

    postMessage(message) {
        const body = JSON.stringify({text: message});
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