const unchained = require('unchained-bitcoin');
const bitcoinjs = require('bitcoinjs-lib');
const axios = require('axios');
const jimp = require('jimp');
const jsqr = require("jsqr");
const qrcode = require('qrcode');
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const uploadImage = promisify(cloudinary.uploader.upload);

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// get base64 of image from url
function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary'))
}

exports.handler = function (context, event, callback) {
  getBase64(event.MediaUrl0).then(async (result) => {
    const imageData = await jimp.read(result);

    // find qr code in image and decode it (assumes picture of xpub)

    try {
      const xpub = jsqr(imageData.bitmap.data, imageData.bitmap.width, imageData.bitmap.height).data;

      let twiml = new Twilio.twiml.MessagingResponse();

      let emptyAddress = false; // this doesn't really matter b/c callback will end function execution
      let index = 0;
      while (!emptyAddress) {
        // get publicKey from xpub + path
        const publicKey = unchained.deriveChildPublicKey(xpub, `m/0/${index}`, "mainnet");

        // get address from publicKey
        const address = bitcoinjs.payments.p2sh({
          redeem: bitcoinjs.payments.p2wpkh({ pubkey: Buffer.from(publicKey, 'hex') }),
        });

        // see if there are any txs on address
        const txs = await (await axios.get(`https://blockstream.info/api/address/${address.address}/txs`)).data;

        // if no txs for address, then send address
        if (txs.length === 0) {
          const datauri = await qrcode.toDataURL(address.address);
          const uploadResp = await uploadImage(datauri);
          twiml.message("Address: " + address.address).media(uploadResp.secure_url);
          callback(null, twiml);
        }
        index = index + 1;
      }
    } catch (e) {
      console.log('e: ', e);
      let twiml = new Twilio.twiml.MessagingResponse();
      twiml.message("Unable to get address. Try sending a different image.");
      callback(null, twiml);
    }
  });
};