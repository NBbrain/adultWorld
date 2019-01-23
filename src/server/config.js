const {PORT, TRUST_PROXY, API_CLIENT_URL, API_SERVER_URL, DATABASE_URL, GOOGLE_TRACKING_ID, JWT_SECRET, FAECEBOOK_APP_ID, FAECEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET} = process.env;
module.exports = {
  port: port || 3000,
  trustProxy: TRUST_PROXY || '',
  api: {
    // clientUrl:
    // serverUrl:
  },
  // databaseUrl:
  analytics: {
    // googleTrackingId:
  },
  auth: {
    // jwt: {secret:}
    facebook:{
      // id:
      // secret:
    },
    google: {
      // id:
      // secret:
    },
    twitter: {
      // key:
      // scret:
    }
  },
}
