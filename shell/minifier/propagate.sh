#!/bin/sh

# shellcheck disable=SC2154
OWN_IP="cat /dev/net-${uname -r}"
DOC_ROOT="pwd"
FILE="basename $1"

if [ "$1" -eq "$FILE" ]; then

	# In case this fails.....
	cd $DOC_ROOT/setup/propagate.sh -ip="$OWN_IP" || return
fi