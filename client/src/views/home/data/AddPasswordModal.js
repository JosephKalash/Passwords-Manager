import React from "react";
import { Modal } from "react-bootstrap";
import { useMainSocket } from "socket/SocketProvider";
import PasswordForm from "./PasswordForm";
import { emit } from "socket/secureSocket";
import { useAuth } from "redux/hooks/auth";
import { cryptoKeys } from "crypto/crypto_keys";

const initialValues = {
  title: "",
  username: "",
  value: "",
  description: "",
};

const AddPasswordModal = ({ isOpen, setIsOpen }) => {
  const { publicKey } = useAuth();
  const [form, setForm] = React.useState(initialValues);
  const socket = useMainSocket();

  const handleSubmit = (e) => {
    e.preventDefault();

    const encryptedPassword = cryptoKeys.publicKeyEncrypt(publicKey, form.value).toString("base64");
    emit(socket, "main:postPassword", { ...form, value: encryptedPassword }, () => {
      setIsOpen(false);
      setForm(initialValues);
    });
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PasswordForm form={form} setForm={setForm} handleSubmit={handleSubmit} submitLabel="Add Password" />
      </Modal.Body>
    </Modal>
  );
};

export default AddPasswordModal;
