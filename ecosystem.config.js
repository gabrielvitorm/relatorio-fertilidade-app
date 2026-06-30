/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "relatorio-fertilidade",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
