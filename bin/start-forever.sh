NODE_OPTIONS="--max-old-space-size=8192" forever start -c "node_modules/.bin/ts-node" -m 10 --spinSleepTime 10000 --minUptime 20000 ./forever.json 3001 5151
