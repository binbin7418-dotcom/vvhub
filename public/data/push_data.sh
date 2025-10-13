#!/bin/zsh
cd /data
git add
git commit -m "auto update list.json $(date '+%Y-%m-%d')"
git push origin main
