#!/usr/bin/env bash

set -e

cd $(dirname $0)

BLUE_ON_WHITE=`tput setab 7 && tput setaf 4`
WHITE_ON_BLUE=`tput setab 4 && tput setaf 7`
UNTIL_EOL=`tput el`
RESET_COLORS=`tput sgr0`

function prettyEcho() {
    echo "$1" \
    | fold -w 80 -s \
    | sed "s/^\(.*\)$/${BLUE_ON_WHITE}    \1${UNTIL_EOL}${RESET_COLORS}/"
}

function ensureCfInstalled() {
    if command cf > /dev/null 2>&1 ; then
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
    if cf target > /dev/null 2>&1 ; then
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

function awaitUserOk() {
    if [[ ${INTERACTIVE} != "false" ]]; then
        USER_PROMPTX=${1:-"Press enter to continue..."}
        echo -n "${WHITE_ON_BLUE}    > ${USER_PROMPTX}${UNTIL_EOL}${RESET_COLORS}" && read
        clear
    fi
}

function welcome() {
    echo "${WHITE_ON_BLUE}${UNTIL_EOL}${RESET_COLORS}"
    echo "${WHITE_ON_BLUE}${UNTIL_EOL}    WELCOME TO AN INTERACTIVE CLOUD FOUNDRY TUTORIAL    ${RESET_COLORS}"
    echo "${WHITE_ON_BLUE}${UNTIL_EOL}${RESET_COLORS}"

    prettyEcho ""
    prettyEcho "We will be exploring Cloud Foundry and cloud-native computing by deploying a simple chat application to Cloud Foundry. The app consists of a Javascript frontend and a Java backend."
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

    eval ${COMMAND}

    awaitUserOk "Done. Press enter to continue with the next step ..."
}

ensureCfInstalled

ensureLoggedIn

welcome

prompt \
    "Let's create a new space for our apps." \
    "cf create-space simple-chat" \

prompt \
    "We have created a new space. But we still have to set it as our current target." \
    "cf target -s simple-chat"

prompt \
    "We must build our frontend and backend first before we deploy them.

The backend is a Java Spring Boot application called 'message-service'. We will build it into a .jar file. The .jar file will be located in 'message-service/target'.

The frontend is a Javascript React application called 'chat-app'. We will build it into a bundle of static files. The bundle will be located in 'chat-app/build'." \
    "./scripts/build.sh"

prompt \
    "Now our applications are ready for deployment. Let's start with the frontend.

Like any Javascript application, the chat-app is a collection of static files. We will use the staticfile_buildpack for deployment.

We want the chat-app to be reachable at 'https://simple-chat.cfapps.io', so we must set the hostname as well. Otherwise, it would default to the application name." \
    "cf push
     chat-app
     -p chat-app/build
     -b staticfile_buildpack
     --hostname simple-chat"

prompt \
    "Congratulations you have successfully deployed an application to Cloud Foundry!

Let's inspect the app." \
    "cf app chat-app"

prompt \
    "You can see that 1 instance of the app is running.

It gets 1GB of memory and 1GB of disk by default. That is more than we need for a staticfile app. Let's scale things down. Memory should be 64M and disk 128M.

This is called vertical scaling. Whenever scaling an app vertically Cloud Foundry has to restart it. This involves downtime. For now we're ok with that, so we add '-f'." \
    "cf scale
     chat-app
     -m 64M
     -k 128M
     -f"

prompt \
    "Go to the browser and open https://simple-chat.cfapps.io

You should see that the app failed to load any messages. Oh dear!

But it makes sense because there's no backend running yet. Let's try to avert this misery and deploy our backend the 'message-service'." \
    "cf push
     message-service
     -p message-service/target/messages-services-0.0.1-SNAPSHOT.jar"

prompt \
    "We have both the frontend and the backend deployed now.

However, when we go to https://simple-chat.cfapps.io it still fails to load any messages. See for yourself.

Why is that?

In order to understand we must look at how traffic is currently routed." \
    "cf routes"

prompt \
    "The frontend is served at simple-chat.cfapps.io
The backend is served at message-service.cfapps.io

The frontend expects to reach the backend at simple-chat.cfapps.io/api
That's the problem!

Cloud Foundry's path-based routing to the rescue. We have to map simple-chat.cfapps.io/api to the message-service." \
    "cf map-route
     message-service
     cfapps.io
     --hostname simple-chat
     --path /api"

prompt \
    "Hooray! The error is gone. The chat-app says there are no messages.

It's time to take out your phone. Go to

    https://simple-chat.cfapps.io

and chat away!

However, the more users there are the more load will our message-service have. At this moment we only have one instance of it running. We need more!

Adding more instances is called horizontal scaling. This does not require a restart and is almost instantaneous.

Let's scale out to 3. Planet scale!" \
    "cf scale message-service -i 3"

prompt \
"This is weird. As we're using the application and sending messages, they change all the time.

Why is that? The problem is that the message-service is currently running with an in-memory database. That means each instance has its own state. And every time we post or get messages we hit another instance. Hence, the inconsistency.

This is setup is violating the idea of stateless processes accordind to the twelve-factor app (https://12factor.net/processes).

Since Cloud Foundry might relocate instances as it sees fit we might loose messages at any moment.

We need a database. Let's ask Cloud Foundry to give us a Postgres." \
"cf create-service elephantsql turtle database"

prettyEcho ""
prettyEcho "waiting for the Postgres database to be created ..."
prettyEcho ""
while ! cf service database | grep status | grep 'create succeeded'; do
    echo . && sleep 1
done

prompt \
"The Postgres instance is ready.

Let's bind it to our message-service.

Cloud Foundry will inject a JDBC connection string into the environment of the message-service." \
"cf bind-service message-service database"

prompt \
"Now in order for the database connection to be picked we have to restart the message-service.

Caveat: In this case it is enough to just restart the application. In other cases we need to restage it for the changes to take effect (see https://docs.cloudfoundry.org/devguide/deploy-apps/start-restart-restage.html)." \
"cf restart message-service"

prettyEcho ""
prettyEcho "As the instances of the message-service have restarted they are all using the database as a backing service. They no longer carry state. We can scale the message-service to our heart's content and the user will not be impacted."
prettyEcho ""
prettyEcho "We're done for now. Stay tuned for updates to this tutorial."
prettyEcho ""
prettyEcho "There's more: https://docs.cloudfoundry.org/#read-the-docs"
prettyEcho ""