# A interactive Cloud Foundry tutorial
Clone and run:
```bash
./playbook.sh
```
The script will walk and talk you through the deployment of a simple (and admittdely very naive) chat application
while exploring the perks and perils of cloud-native apps.

If anything goes wrong during the tutorial just run
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