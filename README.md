# An interactive Cloud Foundry tutorial
Clone and run:
```bash
./playbook.sh
```
The script will walk and talk you through the deployment of a simple (and admittdely very naive) chat application
while exploring the perks and perils of cloud-native apps.

You can run the tutorial in non-interactive mode with:
```bash
INTERACTIVE=false ./playbook.sh
```

If anything goes wrong during the tutorial just stop it, run:
```bash
./destroy.sh
```
and start from scratch.

> disclaimer: this tutorial currently assumes you're using [run.pivotal.io](https://run.pivotal.io)

## Object of study: "a (very) simple chat"
The object of study is a simple chat application. It consists of a Javascript React frontend `chat-app` and Java Spring Boot backend `message-service`. The `chat-app`
allows you to post messages to the `message-service` while it continuously keeps polling from it. This is not a great
architecture for a chat application. And you are urged not to take pointers for production-ready application deisgn. 
But it serves the purpose of exploring Cloud Foundry and cloud-native computing.

## `message-service`

Run with Postgres:
```bash
docker-compose up -d
./run-backend.sh -Dspring.profiles.active=postgres
```

## `chat-app`
todo

## Backlog

The personas:
 * **Clara** wants to learn about Cloud Foundry and is doing the tutorial
 * **Chad** wants to chat with people on the internet and is using the chat application
 * **Ash** wants to enable developers in using Cloud Foundry and is the maintainer of the tutorial 

### As Clara ...
 * [ ] when I visit the tutorial I get a brief idea what it's all about (https://asciinema.org/)
 * [ ] I understand the basic functionality of `chat-app` and `message-service` (calls, polling and endpoints)
 * [x] I learn how to deploy a frontend app
 * [x] I understand how to deploy a backend app
 * [x] I understand how to let the frontend consume the backend
 * [x] I understand how to scale an app vertically
 * [ ] I understand how to scale an app horizontally
 * [ ] I understand how to the problems in stateful apps
 * [ ] I understand how to provision a database service
 * [ ] I understand how to bind the database instance to my backend

### As Chad ...
 * [x] I can see a placeholder of there are no messages
 * [x] I can see a messages
 * [x] I can see a messages continuously updating
 * [x] I can see an error if messages fail to load
 * [x] I can submit a message
 * [x] I can submit a message via my mobile device
 * [ ] I can see messages in order of submission
 * [ ] I know the site is secure because it always uses https
 * [ ] I can submit a message by hitting the enter key
 * [ ] I can only see the n (20?) latest messages
 * [ ] I can an indicator while messages are loading
 * [ ] I can see an error if my message fails to be sent
 * [ ] when I submit a message, messages are being reloaded
 * [ ] when I load the site I get a username assigned
 * [ ] my username survives page reloads
 * [ ] I can the time a message was submitted at
 * [ ] I can tell who submitted a message
 * [ ] when I visit the page with my mobile device, it looks good

### As Ash ...
 * [ ] I know that the chat application because it is unit tested
 * [ ] I know the whole deployment works because I can run acceptance tests
 * [ ] I don't have to worry about the `simple-chat` hostname because all routes are random
 * [ ] I get feedback about the tutorial
