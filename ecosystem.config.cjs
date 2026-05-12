module.exports = {
  apps: [
    {
      name: 'MoGoFun-4300',
      script: '/home/aigc/service/voice/web_dist/mogofun_dist/server/index.mjs',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        PORT: 4300,
        HOST: '0.0.0.0',
        NODE_PATH: '/home/aigc/service/voice/web_dist/mogofun_dist/server/node_modules'
      },
      time: true
    }
  ]
}
