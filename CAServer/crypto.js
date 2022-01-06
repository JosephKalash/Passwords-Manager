const {
    publicEncrypt,
    privateDecrypt,
    createSign,
    createVerify,
    generateKeyPairSync,
  } = require("crypto");


module.exports = {
    getSigner:()=> createSign('rsa-sha256'),
    getVerifier:()=> createVerify('rsa-sha256'),
  };
  