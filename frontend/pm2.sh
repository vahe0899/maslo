#!/bin/bash

output=$(pm2 id $1)

if [[ $output != *"[]"* ]]; then
    pm2 restart $1
    echo "Restarted \"$1\"."
else
    pm2 start npm --name $1 -- start
    echo "Started \"$1\"."
    pm2 save
    # pm2 startup
fi

