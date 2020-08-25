const exec = require('child_process').exec;

const createFunction = async (serviceSid) => {
  const functionResp = await client.serverless.services(serviceSid)
    .functions
    .create({
      friendlyName: 'twilio-fun'
    });
  return functionResp;
}


const uploadFunctionVersion = async (serviceSid, functionSid, filename, path) => {
  console.log(`Uploading function ${filename}...`)
  return new Promise((resolve, reject) => {
    exec(`
      curl -X POST "https://serverless-upload.twilio.com/v1/Services/${serviceSid}/Functions/${functionSid}/Versions" \
      -F "Content=@${filename}; type=application/javascript" \
      -F "Path=/${path}" \
      -F "Visibility=public" \
      -u "${process.env.ACCOUNT_SID}:${process.env.AUTH_TOKEN}"
    `, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      resolve(stdout);
    });
  })
}

module.exports = {
  uploadFunctionVersion
}