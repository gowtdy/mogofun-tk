#!/bin/sh
pm2 stop MoGoFun-4202
sleep 1
pm2 start ecosystem.config.cjs
