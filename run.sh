#!/usr/bin/env bash

set -e

cd $(dirname $0)

BLUE_ON_WHITE=`tput setab 7 && tput setaf 4`
WHITE_ON_BLUE=`tput setab 4 && tput setaf 7`
UNTIL_EOL=`tput el`
RESET_COLORS=`tput sgr0`

CHAT_APP_URL="<if you see this the chat-app url wasn't parsed>"
CHAT_APP_HOSTNAME="<if you see this the chat-app hostname wasn't parsed>"
MESSAGE_SERVICE_URL="<if you see this the message-service url wasn't parsed>"
MESSAGE_SERVICE_HOSTNAME="<if you see this the message-service hostname wasn't parsed>"

function prettyEcho() {
    echo "$1" \
    | fold -w 80 -s \
    | sed "s/^\(.*\)$/${BLUE_ON_WHITE}    \1${UNTIL_EOL}${RESET_COLORS}/"
}

function ensureCfInstalled() {
    if [[ ${DRY} == "true" ]] || command cf > /dev/null 2>&1 ; then
        : # noop
    else
        prettyEcho ""
        prettyEcho "The \"cf\" cli seems to be missing."
        prettyEcho ""
        prettyEcho "Learn how to install it at:"
        prettyEcho ""
        prettyEcho "    https://docs.cloudfoundry.org/cf-cli/install-go-cli.html"
        prettyEcho ""
        prettyEcho "Once you've installed it, come back. We'll be getting a coffee in the meantime."
        prettyEcho ""
        exit 1
    fi
}

function ensureLoggedIn() {
    if [[ ${DRY} == "true" ]] || cf target > /dev/null 2>&1 ; then
        : # noop
    else
        prettyEcho ""
        prettyEcho "You seem not to be logged in. Run:"
        prettyEcho ""
        prettyEcho "    $ cf login -a api.run.pivotal.io"
        prettyEcho ""
        prettyEcho "and come back. We'll be waiting for you."
        prettyEcho ""
        exit 1
    fi
}

function updateChatAppUrl() {
    CHAT_APP_URL=$(cf app chat-app | grep routes | sed "s/routes: *//")
    CHAT_APP_HOSTNAME=$(echo ${CHAT_APP_URL} | cut -d '.' -f1)
}

function updateMessageServiceUrl() {
    MESSAGE_SERVICE_URL=$(cf app message-service | grep routes | sed "s/routes: *//")
    MESSAGE_SERVICE_HOSTNAME=$(echo ${CHAT_APP_URL} | cut -d '.' -f1)
}

function awaitUserOk() {
    if [[ ${INTERACTIVE} != "false" ]]; then
        USER_PROMPTX=${1:-"Press enter to continue..."}
        echo -n "${WHITE_ON_BLUE}    > ${USER_PROMPTX}${UNTIL_EOL}${RESET_COLORS}" && read
        clear
    fi
}

function welcome() {
    clear
    echo "${WHITE_ON_BLUE}${UNTIL_EOL}${RESET_COLORS}"
    echo "${WHITE_ON_BLUE}${UNTIL_EOL}    WELCOME TO AN INTERACTIVE CLOUD FOUNDRY TUTORIAL    ${RESET_COLORS}"
    echo "${WHITE_ON_BLUE}${UNTIL_EOL}${RESET_COLORS}"

    prettyEcho ""
    prettyEcho "We will be exploring Cloud Foundry and cloud-native computing by deploying a simple chat application to Cloud Foundry."
    prettyEcho ""
    prettyEcho "The frontend is a Javascript React application and the backend is Java Spring Boot web application."
    prettyEcho ""
    prettyEcho "Are you ready? We can't wait. Let's go!"
    prettyEcho ""

    awaitUserOk "Press enter to start ..."
}

function prompt() {
    PROMPT=$1
    COMMAND=$2

    prettyEcho ""
    prettyEcho "${PROMPT}"
    prettyEcho ""
    prettyEcho "Command:"
    prettyEcho ""
    prettyEcho "$ ${COMMAND}"
    prettyEcho ""

    awaitUserOk "Press enter to run the command ..."

    prettyEcho ""
    prettyEcho "${COMMAND}"
    prettyEcho ""
    prettyEcho "running ..."
    prettyEcho ""

    if [[ ${DRY} != "true" ]] ; then
        eval ${COMMAND}
    fi

    awaitUserOk "Done. Press enter to continue with the next step ..."
}

ensureCfInstalled

ensureLoggedIn

welcome

prompt \
    "Let's create a new space for our apps." \
    "cf create-space interactive-cloud-foundry-tutorial" \

prompt \
    "We have created a new space. But we still have to set it as our current target." \
    "cf target -s interactive-cloud-foundry-tutorial"

#prompt \
#    "We must build our frontend and backend first before we deploy them.
#
#The backend is a Java Spring Boot web application called 'message-service'. It exposes two endpoints:
#
#    GET  /api/messages : returns list of messages
#    POST /api/messages : creates a new message
#
#If it does not have a database attached it will run with an in-memory database.
#We will build it into a .jar file. The .jar file will be located in 'message-service/target'.
#
#The frontend is a Javascript React application called 'chat-app'. It continuously polls the message-service for messages and allows to create new ones.
#
#We will build it into a bundle of static files. The bundle will be located in 'chat-app/build'." \
#    "./scripts/build.sh"

prompt \
    "Now our applications are ready for deployment. Let's start with the frontend.

Like any Javascript application, the chat-app is just a collection of static files that we want to serve. Hence, we will use the \"staticfile_buildpack\" for running it.

We will let Cloud Foundry pick a random available route for us." \
    "cf push
     chat-app
     -p chat-app/build
     -b staticfile_buildpack
     --random-route"

#CHAT_APP_URL=$(cf app chat-app | grep routes | sed "s/routes: *//")
#CHAT_APP_HOSTNAME=$(echo ${CHAT_APP_URL} | cut -d '.' -f1)
updateChatAppUrl

prompt \
    "Congratulations you have successfully deployed an application to Cloud Foundry!

The chat-app is served at

    https://${CHAT_APP_URL}

Let's inspect the app." \
    "cf app chat-app"

prompt \
    "You can see that 1 instance of the app is running. It has the default 1GB of memory and 1GB of disk. That is more than we need for a staticfile app. Let's scale things down. Memory should be 64M and disk 128M.

This is called vertical scaling. Whenever scaling an app vertically Cloud Foundry has to restart it. This involves downtime. For now we're ok with that, so we add '-f'." \
    "cf scale
     chat-app
     -m 64M
     -k 128M
     -f"

prompt \
    "Now let's open the application at

    https://${CHAT_APP_URL}

You should see that the app failed to load any messages. Oh dear! That's because its backend isn't running yet. But our frontend is a good Cloud-citizen and handles issues with its downstream dependencies gracefully. That's an essential property of any cloud-native application.

Let's avert this misery and deploy the message-service. Again, we let Cloud Foundry pick a random available route for us." \
    "cf push
     message-service
     -p message-service/target/messages-services-0.0.1-SNAPSHOT.jar
     --random-route"

#MESSAGE_SERVICE_URL=$(cf app message-service | grep routes | sed "s/routes: *//")
#MESSAGE_SERVICE_HOSTNAME=$(echo ${MESSAGE_SERVICE_URL} | cut -d '.' -f1)
updateMessageServiceUrl

prompt \
    "The message-service is deployed and served at ${MESSAGE_SERVICE_URL}.

We have both the frontend and the backend deployed now. However, when we visit

    https://${CHAT_APP_URL}

it still fails to load any messages. See for yourself.

Why is that?

In order to understand we must look at how traffic is currently routed." \
    "cf routes"

prompt \
    "The frontend is served at ${CHAT_APP_URL}
The backend is served at  ${MESSAGE_SERVICE_URL}

But frontend expects to reach the backend at ${CHAT_APP_URL}/api. Mind the '/api'. That's the problem!

Cloud Foundry's path-based routing to the rescue.

Let's map the route '${CHAT_APP_URL}/api' to the message-service." \
    "cf map-route
     message-service
     cfapps.io
     --hostname ${CHAT_APP_HOSTNAME}
     --path /api"

prompt \
    "Hooray! The error is gone. The chat-app says there are no messages.

It's time to take out your phone. Go to

    https://${CHAT_APP_URL}

and chat away!

However, the more users there are the more load will our message-service have. At this moment we only have one instance of it running. We need more!

Adding more instances is called horizontal scaling. This does not require a restart and is almost instantaneous.

Let's scale out to 3. Planet scale!" \
    "cf scale message-service -i 3"

prompt \
"This is weird. As we're using the application and sending messages, they change all the time.

Why is that? As we haven't provided it with a database, the message-service is running with an in-memory database. That means each instance has its own state. And every time we post or get messages we hit another instance. Hence, the inconsistency.

This setup is violating the idea of 'stateless processes' according to the twelve-factor app (https://12factor.net/processes).

Since Cloud Foundry might relocate instances in the cloud as it sees fit we might loose messages at any moment.

We need a database. Let's browse the marketplace."\
    "cf marketplace"

prompt \
"We can see there are plenty of services on offer, e.g.

    * Redis
    * Elasticsearch
    * Sendgrid
    * MongoDB
    * app-autoscaler
    * ...

Every service is available with different plans. Some are free, some incur cost.

Let's ask Cloud Foundry to give us a Postgres instance." \
"cf create-service
     elephantsql
     turtle
     database"

prettyEcho ""
prettyEcho "waiting for the Postgres database to be created ..."
prettyEcho ""

if [[ ${DRY} != "true" ]]; then
    while ! cf service database | grep status | grep 'create succeeded'; do
        echo -n . && sleep 1
    done
fi

prompt \
"The Postgres instance is ready.

We still need to \"bind\" it to our message-service.

When we do that Cloud Foundry will inject the necessary data into the message-service's environment. In this case a JDBC connection string." \
"cf bind-service message-service database"

prompt \
"But that's not all. We have to restart the message-service.

Since we're using Spring Boot it will will automatically pick up the database.

Caveat: In this case it is enough to just restart the application. In other cases we need to restage it for the changes to take effect (see https://docs.cloudfoundry.org/devguide/deploy-apps/start-restart-restage.html)." \
"cf restart message-service"

prettyEcho ""
prettyEcho "As the instances of the message-service have restarted they are all using the database as a backing service. They no longer carry state. We can scale the message-service to our heart's content and the user will not be impacted."
prettyEcho ""

awaitUserOk

prettyEcho ""
prettyEcho "That's all for now. Stay tuned for updates to this tutorial."
prettyEcho ""
prettyEcho "Feel free to tear down the entire deployment with ./scripts/destroy.sh"
prettyEcho ""
prettyEcho "You're feedback is very important! Go to"
prettyEcho ""
prettyEcho "    github.com/mamachanko/interactive-cloud-foundry-tutorial"
prettyEcho ""
prettyEcho "add a star, open an issue or send a PR."
prettyEcho ""
prettyEcho "There's more: https://docs.cloudfoundry.org/#read-the-docs"
prettyEcho ""