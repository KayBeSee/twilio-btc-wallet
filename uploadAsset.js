const uploadAsset = async (serviceSid, assetSid, filename, path) => {
  const resp = exec(`
    curl -X POST "https://serverless-upload.twilio.com/v1/Services/${serviceSid}/Assets/${assetSid}/Versions" \
    -F "Content=@${filename}; type=image/png" \
    -F "Path=/${path}" \
    -F "Visibility=public" \
    -u "${process.env.ACCOUNT_SID}:${process.env.AUTH_TOKEN}"
  `);

  resp.stdout.on('data', function (data) {
    console.log(data);
  });
}

exports.default = uploadAsset;