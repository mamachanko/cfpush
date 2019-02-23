#!/usr/bin/env bash -e

function awaitUserOk() {
    if [[ ${INTERACTIVE} != "false" ]]; then
        echo -n "Press enter to continue..." && read
        clear
    fi
}

function prompt() {
    PROMPT=$1
    COMMAND=$2

    echo "
    ${PROMPT}

    Command:

        $ ${COMMAND}
    "
    awaitUserOk
    echo
    echo "    ${COMMAND}"
    echo
    eval ${COMMAND}
}

echo
echo "--- The interactive Cloud Foundry tutorial ---"
echo "
    We will be exploring Cloud Foundry and cloud-native computing by
    deploying simple chat app to Cloud Foundry. The app consists of
    a Javascript frontend and a Java backend.

    (this tutorial currently assumes to be run against run.pivotal.io)

    Make sure you're logged in.

    Are you ready?

    Let's go!
"
awaitUserOk

prompt \
    "Let's create a new space for our apps." \
    "cf create-space simple-chat" \

prompt \
    "We have created a new space. But we still have to set it as our current target." \
    "cf target -s simple-chat"

prompt \
    "We must build our frontend and backend first before we deploy them.

    The backend is a Java Spring Boot application called 'message-service'.
    We will build it into a .jar file. The .jar file will be located
    in 'message-service/target'.

    The frontend is a Javascript React application called 'chat-app'.
    We will build it into a bundle of static files. The bundle will be
    located in 'chat-app/build'." \
    "./build.sh"

prompt \
    "Now our applications are ready for deployment. Let's start with the frontend.

    Like any Javascript application, the chat-app is a collection of static files.
    We will use the staticfile_buildpack for deployment.

    We want the chat-app to be reachable at 'https://simple-chat.cfapps.io',
    so we must set the hostname as well. Otherwise, it would default to the
    application name." \
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

    It gets 1GB of memory and 1GB of disk by default. That is more than we need for a
    staticfile app. Let's scale things down. Memory should be 64M and disk 128M.

    This is called vertical scaling. Whenever scaling an app vertically Cloud Foundry
    has to restart it. This involves downtime. For now we're ok with that, so we add '-f'." \
    "cf scale
             chat-app
             -m 64M
             -k 128M
             -f"

prompt \
    "Go to the browser and open https://simple-chat.cfapps.io

    You should see that the app failed to load any messages. Oh dear!

    But it makes sense because there's no backend running yet. Let's try to avert
    this misery and deploy our backend the 'message-service'." \
    "cf push
             message-service
             -p message-service/target/messages-services-0.0.1-SNAPSHOT.jar"

prompt \
    "We have both the frontend and the backend deployed now.

    However, when we go to https://simple-chat.cfapps.io it still fails to load
    any messages. See for yourself.

    Why is that?

    In order to understand we must look at how traffic is currently routed." \
    "cf routes"

prompt \
    "The frontend is served at simple-chat.cfapps.io
    The backend is served at message-service.cfapps.io

    The frontend expects to reach the backend at simple-chat.cfapps.io/api
    That's the problem!

    Cloud Foundry's path-based routing to the rescue. We have to map
    simple-chat.cfapps.io/api to the message-service." \
    "cf map-route
             message-service
             cfapps.io
             --hostname simple-chat
             --path /api"

prompt \
    "Hooray! The error is gone. The chat-app says there are no messages.

    It's time to take out your phone. Go to https://simple-chat.cfapps.io and chat away!" \
    "echo \"we're done for now. stay tuned for more.\""
