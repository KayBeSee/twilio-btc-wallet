require('dotenv').config()

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const deploy = (serviceSid, environmentSid, buildSid) => {
  return new Promise((resolve, reject) => {
    client.serverless.services(serviceSid)
      .environments(environmentSid)
      .deployments
      .create({
        buildSid: buildSid
      })
      .then(deployment => { resolve(deployment) })
      .catch(e => console.log('e: ', e))
  })
}

module.exports = {
  deploy
}