import React from "react";
import { confirmAlert } from "react-confirm-alert";
import SweetAlert from "react-bootstrap-sweetalert";

const func = (options) => {
  confirmAlert({
    customUI: ({ onClose }) => <CustomUI onClose={onClose} options={options} />,
  });
};
export default func;

function CustomUI({ onClose, options }) {
  return (
    <SweetAlert
      title={`DELETE, Are you sure?`}
      warning
      show={true}
      showCancel
      reverseButtons
      cancelBtnBsStyle="danger"
      confirmBtnText="Yes, delete it!"
      cancelBtnText="Cancel"
      onConfirm={() => {
        options.onConfirm();
        onClose();
      }}
      onCancel={onClose}
    >
      You won't be able to revert this!
    </SweetAlert>
  );
}
