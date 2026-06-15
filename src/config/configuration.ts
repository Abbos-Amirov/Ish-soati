export default () => ({
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/ish-soati',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change_this_secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
});
