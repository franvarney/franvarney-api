franvarney-api
==============
The back-end for my personal website.

## Config

- `NODE_ENV`: self-explanatory
- `AUTH_TOKEN`: a token in the format `Authorization: Bearer 12345`
- `GITHUB_ACCESS_TOKEN`: a GitHub token
- `GITHUB_USERNAME`: a GitHub username
- `GOOGLE_API_KEY`: a Google API key
- `JOBS_FREQUENCY_GITHUB`: the frequency at which to run the GitHub script that collects activities (cron format)
- `HOST`: the host
- `MONGO_URL`: a MongoDB connection string
- `DEBUG`: debug level
- `JOBS_FREQUENCY_CACHE`: the frequency at which to run the script that caches GitHub activities (cron format)
- `FLICKR_KEY`: a Flickr API key
- `FLICKR_SECRET`: a Flickr secret
- `FLICKR_USER_ID`: a Flickr user id (might be able to use a username?)

## Start

1. `npm install`
2. `npm start`

## Test
TODO
