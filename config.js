export default {
  authToken: process.env.AUTH_TOKEN || 'secret',
  env: process.env.NODE_ENV,
  flickr: {
    apiKey: process.env.FLICKR_API_KEY || '123abc',
    secret: process.env.FLICKR_SECRET || '123abc'
  },
  host: process.env.HOST || 'localhost',
  github: {
    apiUrl: 'https://api.github.com',
    username: process.env.GITHUB_USERNAME || 'username',
    accessToken: process.env.GITHUB_ACCESS_TOKEN || '123abc'
  },
  jobs: {
    frequency: {
      githubActivity: process.env.JOBS_FREQUENCY_GITHUB || '00 */1 * * * *',
      updateCache: process.env.JOBS_FREQUENCY_CACHE || '00 */2 * * * *'
    }
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/FranVarney'
  },
  port: process.env.PORT || 8000
}
