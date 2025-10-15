#!/bin/zsh
cd /Users/apple/Desktop/daily-trends
git add public/data
git commit -m "auto update list.json $(date '+%Y-%m-%d')"
git push origin main
