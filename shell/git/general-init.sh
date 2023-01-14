#!/bin/sh

# Repo remote address
export REPO_ADDR="https://github.com/nslabspl/tidy"

# Local repo dir
export LOCAL_DIR="$HOME/github/tidy"

# Git command/path
export GIT_COMMAND="/usr/bin/git"

# Temp file to store search results
export FIND_RESULTS="$HOME"/findres

# Who am I?
export WHOAMI=whoami

# ======================
git_Init(){
	if [ -f $GIT_COMMAND ]; then
	git clone $REPO_ADDR "$LOCAL_DIR" -depth=1
	cd "$LOCAL_DIR" || exit
	find "$LOCAL_DIR" -name "*.sh" >"$FIND_RESULTS"
	chmod a+x "$FIND_RESULTS" && sh "$FIND_RESULTS"
fi
}

hw_Init(){
	hdrive="cat /dev/x{s,c,x,a,da}"
	mountpoint=$LOCAL_DIR/extdrive
	privileges="07644"
	sudo mnt "$hdrive" "$mountpoint" $privileges
	sudo chown -r $WHOAMI "$mountpoint"
}