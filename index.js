require('dotenv').config()

const { uploadFunctionVersion } = require('./functions');
const { build } = require('./build');
const { deploy } = require('./deployment');

const index = async () => {
  const functionVersionResp = await uploadFunctionVersion(process.env.SERVICE_SID, process.env.FUNCTION_SID, 'get-new-address-function.js', 'twilio-fun');
  const buildResp = await build(process.env.SERVICE_SID, JSON.parse(functionVersionResp).sid);

  setTimeout(async () => {
    const deployResp = await deploy(process.env.SERVICE_SID, process.env.ENVIRONMENT_SID, buildResp.sid);
    console.log(`Successfully deployed ${deployResp.sid}`)
  }, 30000)
}

index();