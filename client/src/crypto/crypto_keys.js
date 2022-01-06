import { randomBytes, createHmac, createCipheriv, createDecipheriv, publicEncrypt, privateDecrypt, createSign, createVerify } from "crypto";
import keypair from "keypair";

export const symmetricKey = randomBytes(32);

export const cryptoKeys = {
  iv: "jgqkQ$^@#62r3f",
  getHmac: (message) => createHmac("sha256", symmetricKey).update(JSON.stringify(message)).digest("hex"),
  getCipher: (key, iv) => createCipheriv("aes256", key, iv),
  getDecipher: (key, iv) => createDecipheriv("aes256", key, iv),
  publicKeyEncrypt: (publicKey, data) => publicEncrypt(publicKey, Buffer.from(data)),
  privateKeyDecrpyt: (privateKey, data) => {
    try {
      return privateDecrypt(privateKey, data).toString();
    } catch (e) {
      return "";
    }
  },
  getSigner: () => createSign("rsa-sha256"),
  getVerifier: () => createVerify("rsa-sha256"),
};

export const generateKeyPair = () => {
  const keys = keypair();
  return {
    privateKey: keys.private,
    publicKey: keys.public,
  };
};
