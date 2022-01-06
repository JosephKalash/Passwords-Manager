const cryptoKeys = require("../crypto_keys");

module.exports = {
  checkDataHmac: function (sendedHmac, data, key) {
    // var bufferKey = StringToBuffer32or16(cryptoKeys.key,32);

    const hmac = cryptoKeys.getHmac(data, key);
    console.log(hmac);
    return hmac === sendedHmac;
  },
  cipher: function (data, key) {
    // var bufferKey = StringToBuffer32or16(cryptoKeys.key, 32);
    const cipher = cryptoKeys.getCipher(key, bufferIv);

    return cipher.update(JSON.stringify(data), "utf8", "hex") + cipher.final("hex");
  },
  decipher: function (data, key) {
    // var bufferKey = StringToBuffer32or16(cryptoKeys.key, 32);

    const decipher = cryptoKeys.getDecipher(key, bufferIv);
    const rowData = decipher.update(data, "hex", "utf8") + decipher.final("utf8");
    return JSON.parse(rowData);
  },
  getHmac: (data,key) => {
    // var bufferKey = StringToBuffer32or16(cryptoKeys.key, 32);

    const hmac = cryptoKeys.getHmac(data, key);
    return hmac;
  },
  getSymmetricByPrivate: (data) => {
    const rowData = cryptoKeys.privateDecrypt(data);
    const syKey = rowData;
    return syKey;
  },
  getSignature:(data,privateKey) => {
    const signer = cryptoKeys.getSigner();
    signer.update(JSON.stringify(data));
    const signature = signer.sign(privateKey,'hex');
    return signature;
  },
  verifySign:(data,signature,publicKey) => {
    const verifier = cryptoKeys.getVerifier();
    verifier.update(JSON.stringify(data));
    const isVerified = verifier.verify(publicKey,signature,'hex');
    return isVerified;
  }
};

const StringToBuffer32or16 = (str, ByteLength) => {
  var str32 = StringTo32or16(str, ByteLength);
  var buffer = new Buffer.from(str32, "utf8");
  return buffer;
};

const StringTo32or16 = (str, ByteLength) => {
  const length = str.length;
  if (length > ByteLength) {
    return str.substr(0, ByteLength - 1);
  } else {
    const limit = ByteLength - length;
    for (let i = 0; i < limit; i++) {
      str += "7";
    }
    return str;
  }
};
var bufferIv = StringToBuffer32or16(cryptoKeys.iv, 16);

const splitIvData = (str) => {
  const components = str.split(":");
  return { iv: components[0], data: components[1] };
};
