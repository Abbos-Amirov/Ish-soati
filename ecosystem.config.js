module.exports = {
  apps: [
    {
      name: 'ish-soati-backend',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        CORS_ORIGIN: 'http://38.247.134.248:5173',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      args: '--max-old-space-size=1024',
    },
  ],
};
