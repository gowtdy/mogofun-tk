#!/bin/sh
pm2 stop MoGoFun-4300
sleep 1
pm2 start ecosystem.config.cjs
