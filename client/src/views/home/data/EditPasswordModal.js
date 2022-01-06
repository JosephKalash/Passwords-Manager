import React from "react";
import { Modal } from "react-bootstrap";
import { useMainSocket } from "socket/SocketProvider";
import PasswordForm from "./PasswordForm";
import { emit } from "socket/secureSocket";
import { decryptPassword } from "crypto/password";
import { useAuth } from "redux/hooks/auth";
import { cryptoKeys } from "crypto/crypto_keys";

const initialValues = {
  title: "",
  username: "",
  value: "",
  description: "",
};

const EditPasswordModal = ({ isOpen, setIsOpen, dataToEdit }) => {
  const [form, setForm] = React.useState(initialValues);
  const { privateKey, publicKey } = useAuth();
  const socket = useMainSocket();

  React.useEffect(() => {
    setForm({
      title: dataToEdit.title,
      username: dataToEdit.username,
      value: decryptPassword(privateKey, dataToEdit.value || ""),
      description: dataToEdit.description || "",
    });
  }, [dataToEdit, privateKey]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const encryptedPassword = cryptoKeys.publicKeyEncrypt(publicKey, form.value).toString("base64");
    emit(socket, "main:editPassword", { id: dataToEdit.id, ...form, value: encryptedPassword }, () => {
      setIsOpen(false);
    });
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PasswordForm form={form} setForm={setForm} handleSubmit={handleSubmit} submitLabel="Save" />
      </Modal.Body>
    </Modal>
  );
};

export default EditPasswordModal;
