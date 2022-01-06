const PREFIX = `ISS_`;
const TEMP_PRIVATE_KEY_PREFIX = `${PREFIX}_TEMP_PRIVATE_KEY_`;
const TEMP_PUBLIC_KEY_PREFIX = `${PREFIX}_TEMP_PUBLIC_KEY_`;
const PRIVATE_KEY_PREFIX = `${PREFIX}_PRIVATE_KEY_`;
const PUBLIC_KEY_PREFIX = `${PREFIX}_PUBLIC_KEY_`;
const TEMP_CA_SIGNATURE_PREFIX = `${PREFIX}_TEMP_CA_SIGNATURE_`;
const CA_SIGNATURE_PREFIX = `${PREFIX}_CA_SIGNATURE_`;

export const tempRegister = (email, { privateKey, publicKey, ca_signature }) => {
  localStorage.setItem(`${TEMP_PRIVATE_KEY_PREFIX}${email}`, privateKey);
  localStorage.setItem(`${TEMP_PUBLIC_KEY_PREFIX}${email}`, publicKey);
  localStorage.setItem(`${TEMP_CA_SIGNATURE_PREFIX}${email}`, ca_signature);
};

export const registerDone = (email) => {
  const privateKey = localStorage.getItem(`${TEMP_PRIVATE_KEY_PREFIX}${email}`);
  const publicKey = localStorage.getItem(`${TEMP_PUBLIC_KEY_PREFIX}${email}`);
  const ca_signature = localStorage.getItem(`${TEMP_CA_SIGNATURE_PREFIX}${email}`);
  localStorage.setItem(`${PRIVATE_KEY_PREFIX}${email}`, privateKey);
  localStorage.setItem(`${PUBLIC_KEY_PREFIX}${email}`, publicKey);
  localStorage.setItem(`${CA_SIGNATURE_PREFIX}${email}`, ca_signature);

  localStorage.removeItem(`${TEMP_PRIVATE_KEY_PREFIX}${email}`);
  localStorage.removeItem(`${TEMP_PUBLIC_KEY_PREFIX}${email}`);
  localStorage.removeItem(`${TEMP_CA_SIGNATURE_PREFIX}${email}`);

  return { privateKey, publicKey, ca_signature };
};

export const registerFail = (email) => {
  localStorage.removeItem(`${TEMP_PRIVATE_KEY_PREFIX}${email}`);
  localStorage.removeItem(`${TEMP_PUBLIC_KEY_PREFIX}${email}`);
  localStorage.removeItem(`${TEMP_CA_SIGNATURE_PREFIX}${email}`);
};

export const getKeyPair = (email) => {
  const privateKey = localStorage.getItem(`${PRIVATE_KEY_PREFIX}${email}`);
  const publicKey = localStorage.getItem(`${PUBLIC_KEY_PREFIX}${email}`);
  const ca_signature = localStorage.getItem(`${CA_SIGNATURE_PREFIX}${email}`);

  return { privateKey, publicKey, ca_signature };
};
