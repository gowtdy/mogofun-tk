export const config = {
    indexVoiceModels: {
      production: '/home/aigc/work/models/aivoice_models/cloned_models/common_models/common_models.yaml',
      development: 'data/common_models.yaml'
    },
    signature: {
      secretKey: '0x4AAAAAABL7dEKVA5-OlS1S',
      soundSecretKey: 'Kvy49gPaoDbiIojFmENTIYKgzE35DiqaTzZegEh5z+M=',
      uploadSecretKey: 'ACpz51zjj2OAi/FqFeut0d9nq7XnTn63/mzQyOO8hgM=',
      coverSecretKey: 'l4AnBbVDNIardm33PyFP0Ki29uLAn9a6xrzNL/6FPuQ='
    },
    domain: 'mogofun.com',
    host: 'https://mogofun.com',
    cdnHost: 'https://cdn.mogofun.com',
    apiHost: 'https://api.mogofun.com',
    localHost: 'http://localhost:3000',
    logoImage: '/img/mogofun_logo.svg',
    wordImage: '/img/mogofun_word.svg',
    ogImage: '/img/mogofun-fbtw.webp',
    twitterImage: '/img/mogofun-tw.webp'
  }