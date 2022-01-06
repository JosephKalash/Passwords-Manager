const {
  createHmac,
  createCipheriv,
  randomBytes,
  createDecipheriv,
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  createSign,
  createVerify
} = require("crypto");

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

module.exports = {
  iv: "jgqkQ$^@#62r3f",
  key:"RgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6",
  getHmac: (message, key) =>
    createHmac("sha256", key).update(JSON.stringify(message)).digest("hex"),
  getCipher: (key, iv) => createCipheriv("aes256", key, iv),
  getDecipher: (key, iv) => createDecipheriv("aes256", key, iv),
  privateDecrypt:(data)=> privateDecrypt(privateKey, data),
  publicKeyEncrypt: (data)=> publicEncrypt(publicKey, Buffer.from(JSON.stringify(data))),
  publicKey:publicKey,
  privateKey:privateKey,
  getSigner:()=> createSign('rsa-sha256'),
  getVerifier:()=> createVerify('rsa-sha256')
};
