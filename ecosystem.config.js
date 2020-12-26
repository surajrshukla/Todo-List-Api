module.exports = {
  apps: [{
    name: 'pro_fractal_todo_api',
    script: 'bin/www',
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'fractal_todo_api',
    script: 'bin/www',
    env_development: {
      NODE_ENV: 'development'
    }
  }
  ]
};
