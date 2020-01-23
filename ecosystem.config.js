module.exports = {
  apps : [{
    name: 'Roberto',
    script: './main.js',
    cwd: '/root/Roberto/',
    instances: 1,
    autorestart: true,
    watch: false
  }]
};
