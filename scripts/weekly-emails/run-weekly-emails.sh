#!/bin/sh
set -e
yarn

node 1-generate-screenshots.js

node 2-push-to-spaces.js

node 3-send-emails.js