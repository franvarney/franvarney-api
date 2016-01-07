export default {
  authToken: process.env.AUTH_TOKEN || 'secret',
  env: process.env.NODE_ENV,
  host: process.env.HOST || 'localhost',
  github: {
    apiUrl: 'https://api.github.com',
    username: process.env.GITHUB_USERNAME || 'username'
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/FranVarney'
  },
  port: process.env.PORT || 8000
}
