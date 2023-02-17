#!/bin/sh

# Repo remote address
export REPO_ADDR="https://codeberg.org/nslabspl/tidy"

# Local repo dir
export LOCAL_DIR="$HOME/github/tidy"

# Git command/path
export GIT_COMMAND="/usr/bin/git"

# Temp file to store search results
export FIND_RESULTS="$HOME"/findres

# Who am I?
export WHOAMI=whoami

get_first_ten_commits_data(){
	i=0
	cd "$LOCAL_DIR" || exit
	for i in seq 0..9;
	do
		git log -"$i" | grep -e "Hash" > "$LOCAL_DIR"/first_ten_commits
	done
}

get_first_commit_id(){
	cd "$LOCAL_DIR" || exit
	commit_id=git log -1 | grep "commitId" > "$LOCAL_DIR"/first_commit_Id
}