//Code From: https://react-bootstrap.github.io/components/modal/
import React, { Component, useState, useEffect  } from "react";
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
  
  export default function CreateGameModal (props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <h1> HI</h1>

      <Modal onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}