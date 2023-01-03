#!/bin/bash

# ENV VARS
APP_NAME="EJS"
APP_VER="0.01"
APP_STATUS="unreleased"
APP_MAIN_ENV="dev"
APP_LIC="MIT"

# Messages
WELCOME_MSG="Welcome in $APP_NAME. Its currently $APP_STATUS. Current version is $APP_VER. This copy comes from $APP_MAIN_ENV channel"

# Display it
echo "$WELCOME_MSG"
echo $APP_LIC