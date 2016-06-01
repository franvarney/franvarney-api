module.exports = {
  authToken: process.env.AUTH_TOKEN || 'secret',
  env: process.env.NODE_ENV,
  host: process.env.HOST || 'localhost',
  github: {
    apiUrl: 'https://api.github.com',
    username: process.env.GITHUB_USERNAME || 'username',
    accessToken: process.env.GITHUB_ACCESS_TOKEN || '123abc'
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY || '123abc',
    nearbySearchApiUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
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
