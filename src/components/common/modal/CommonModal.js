import React from 'react';
import { Modal } from 'react-bootstrap';

function CommonModal({ show, onHide, title, body, footer }) {

    return (

        <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title><h2>{title}</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body ><h3>{body}</h3></Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
        
    );

}

export default CommonModal;