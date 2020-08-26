require('dotenv').config()

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

client.serverless.services(process.env.SERVICE_SID)
  .environments(process.env.ENVIRONMENT_SID)
  .logs
  .list()
  .then(deployment => console.log(deployment))
  .catch(e => console.log('e: ', e))