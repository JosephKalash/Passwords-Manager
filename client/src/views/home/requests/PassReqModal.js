import React from "react";
import { Modal, Badge, Accordion } from "react-bootstrap";
import { useMainSocket } from "socket/SocketProvider";
import { useAuth } from "redux/hooks/auth";
import SingleRequest from "./SingleRequest";
import { toast } from "react-toastify";

const PassReqModal = ({ isOpen, setIsOpen }) => {
  const { userID } = useAuth();
  const [requests, setRequests] = React.useState([]);
  const socket = useMainSocket();

  React.useEffect(() => {
    if (!isOpen) return;
    socket.emit("main:getSharedPass", userID);
    socket.on("main:gotSharedPasses", (sharedPasswords) => {
      if (sharedPasswords) {
        setRequests(sharedPasswords);
      }
    });

    socket.on("main:sharedPassDeleted", ({ isSuccess, id }) => {
      if (isSuccess) {
        toast.success("Password Request has been Deleted Successfully");
        setRequests((reqs) => reqs.filter((req) => req.id !== id));
      } else {
        toast.error("Failed to Delete password request");
      }
    });

    socket.on("main:sharedPasswordAccepted", (id) => {
      setRequests((reqs) => reqs.filter((req) => req.id !== id));
    });

    return () => {
      socket.off("main:gotSharedPasses");
      socket.off("main:sharedPassDeleted");
      socket.off("main:sharedPasswordAccepted");
    };
  }, [isOpen, socket, userID]);

  return (
    <Modal centered size="lg" show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Password Requests{" "}
          <Badge bg="warning" text="dark">
            {requests.length}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {requests.length === 0 ? (
          <div style={{ height: "10rem" }} className="d-flex align-items-center justify-content-center">
            <h5>No Requests</h5>
          </div>
        ) : (
          <>
            {requests.map((req) => (
              <Accordion key={req.id}>
                <Accordion.Item eventKey={req.id}>
                  <Accordion.Header>
                    {req.sender.id} | {req.sender.name} | {req.sender.email}
                  </Accordion.Header>
                  <Accordion.Body>
                    <SingleRequest req={req} />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PassReqModal;
