module.exports = {
  apps: [{
    name: 'blog',
    script: './server/javascript/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-15-152-55.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/tutorial.pem',
      ref: 'origin/master',
      repo: 'https://github.com/reichert621/blog.git',
      path: '/home/ubuntu/blog',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
