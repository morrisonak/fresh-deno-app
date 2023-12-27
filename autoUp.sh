#!/bin/bash

# Change to the project directory
cd /home/justice/fresh-deno-app/

git pull
# Execute the bun command
/home/justice/.bun/bin/bun run v0r2.ts

git add static/images/*.jpg


# Add links.json to the staging area
git add links.json

git add users.json
# Commit with a message including the current timestamp
currentTimeStamp=$(date)
git commit -m "update json at $currentTimeStamp"

# Push the commit to the remote repository
git push

# Echo a success message
echo "Links successfully updated"

