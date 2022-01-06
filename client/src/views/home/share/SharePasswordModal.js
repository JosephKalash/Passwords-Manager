import React from "react";
import { Modal } from "react-bootstrap";
import UsersList from "./UsersList";

const SharePasswordModal = ({ isOpen, setIsOpen, dataToShare }) => {
  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Share Password: {dataToShare.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{isOpen && <UsersList dataToShare={dataToShare} />}</Modal.Body>
    </Modal>
  );
};

export default SharePasswordModal;
