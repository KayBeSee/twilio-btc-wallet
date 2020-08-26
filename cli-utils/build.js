require('dotenv').config()
const { dependencies } = require('./dependencies');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const build = (serviceSid, functionVersionSid) => {
  console.log(`Building ${functionVersionSid}...`)
  return new Promise((resolve, reject) => {
    client.serverless.services(serviceSid)
      .builds
      .create({
        functionVersions: functionVersionSid,
        dependencies: JSON.stringify(dependencies)
      })
      .then(build => {
        resolve(build);
      })
      .catch(e => console.log('e: ', e))
  })
}

module.exports = {
  build
}