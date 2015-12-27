export default {
  env: process.env.NODE_ENV,
  host: process.env.HOST || 'localhost',
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/FranVarney'
  },
  port: process.env.PORT || 8000
}
