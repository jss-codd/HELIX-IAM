#!/bin/sh
    git pull 
    npm install
    pm2 restart Admin-dash
    # pm2 save
    exit
EOF