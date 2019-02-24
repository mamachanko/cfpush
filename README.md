# An interactive Cloud Foundry tutorial
Clone and run:
```bash
./run.sh
```
The script will walk and talk you through the deployment of a simple (and admittdely very naive) chat application
while exploring the perks and perils of cloud-native apps.

[![asciicast](https://asciinema.org/a/229675.svg)](https://asciinema.org/a/229675)

You can run the tutorial in non-interactive mode with:
```bash
INTERACTIVE=false ./playbook.sh
```

If anything goes wrong during the tutorial just stop it, run:
```bash
./scripts/destroy.sh
```
and start from scratch.

You're feedback is very welcome. Feel free to raise an issue if anything should be unclear or you run into any problems.

## Prerequisites

This tutorial currently assumes you're using [run.pivotal.io](https://run.pivotal.io). If you sign up you get 87$ of quota for free.

You will need the `cf` cli. If you don't have it installed yet, go [here](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html).

## Object of study: "a (very) simple chat"
The object of study is a simple chat application. The frontend is a Javascript React application, the `chat-app`. The backend is a Java Spring Boot web application, the `message-service`.
The `chat-app` continuously polls `message-service` for messages and allows you to create new messages. This is not a great
architecture for a chat application. And you are urged not to take pointers for production-ready application design. 
But it serves the purpose of exploring Cloud Foundry and cloud-native computing.

## `message-service`
The backend is a Java Spring Boot web application. It exposes two endpoints:

    GET  /api/messages : returns list of messages
    POST /api/messages : creates a new message

Run with an in-memory database:
```bash
./scripts/run-backend.sh
```

Run with Postgres:
```bash
docker-compose up -d
./scripts/run-backend.sh -Dspring.profiles.active=postgres
```

There are a utility scripts:
```bash
# list messages
./scripts/get-messages.sh # defaults to localhost:8080
./scripts/get-messages.sh 'message-service.cfapps.io'

# create a random message
./scripts/post-message.sh # defaults to localhost:8080
./scripts/post-message.sh 'message-service.cfapps.io'
```

## `chat-app`
The frontend is a Javascript React application. 
It continuously polls the `message-service` for messages and allows you to send new messages to it.
It will tell you if it fails to reach the backend.

![chat-app](./chat-app.png =100x)

## Backlog

Our personas:
 * **Clara** wants to learn about Cloud Foundry and is doing the tutorial
 * **Chad** wants to chat with people on the internet and is using the chat application
 * **Ash** wants to enable developers in using Cloud Foundry and is the maintainer of the tutorial 

### As Clara ...
 * [x] when I visit the tutorial I get a brief idea what it's all about (https://asciinema.org/)
 * [x] I understand the basic functionality of `chat-app` and `message-service` (calls, polling and endpoints)
 * [x] I know how to log into Cloud Foundry / _Pivotal Web Services_
 * [x] when I am not logged in yet, the tutorial stops and tells me how to do that
 * [x] I learn how to deploy a frontend app
 * [x] I understand how to deploy a backend app
 * [x] I understand how to let the frontend consume the backend
 * [x] I understand how to scale an app vertically
 * [x] I understand how to scale an app horizontally
 * [x] I understand how to the problems in stateful apps
 * [x] I understand how to provision a database service
 * [x] I understand how to bind the database instance to my backend
 * [ ] when I have further questions I pointers to the docs at the right moment
 * [ ] I understand how to run one-off management tasks (e.g. truncate db)
 * [ ] I understand how to do no-downtime deployments 
 * [ ] I understand how to schedule one-off management tasks (e.g. db backup)

### As Chad ...
 * [x] I can see a placeholder of there are no messages
 * [x] I can see a messages
 * [x] I can see a messages continuously updating
 * [x] I can see an error if messages fail to load
 * [x] I can submit a message
 * [x] I can submit a message via my mobile device
 * [x] I can see messages in order of submission
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
 * [ ] I know that the chat application works because it is unit tested
 * [ ] I know the whole deployment works because I can run acceptance tests
 * [ ] I know that the tutorial will work for users who don't "own" `simple-chat.cfapps.io` and `message-service.cfapps.io`
 * [ ] I get feedback about the tutorial
 * [ ] I know this repository has the [right license](https://choosealicense.com)
 * [ ] I want to use `spring-data-rest` so that I don't have to worry about application logic too much
 * [ ] I want to use web sockets so that the example is less contrived
 * [ ] I don't have to worry about Clara's environment and can simply provider them with a docker image
