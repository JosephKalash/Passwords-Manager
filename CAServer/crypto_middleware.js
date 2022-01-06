const cryptoKeys = require("./crypto");
const fs = require('fs')

const publicKey = fs.readFileSync('./data/public.txt', 'utf8');
const privateKey = fs.readFileSync('./data/private.txt', 'utf8');

module.exports = {
  getSignature:(data) => {
    const signer = cryptoKeys.getSigner();
    signer.update(JSON.stringify(data));
    const signature = signer.sign(privateKey,'hex');
    return signature;
  },
  verifySign:(data,signature) => {
    const verifier = cryptoKeys.getVerifier();
    verifier.update(JSON.stringify(data));
    const isVerified = verifier.verify(publicKey,signature,'hex');
    return isVerified;
  }
};
