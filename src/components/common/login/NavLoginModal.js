import React from 'react';
import { Modal } from 'react-bootstrap';

function NavLoginModal({ show, onHide, title, body, footer }) {
    return (
        <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body >{body}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
    );
}

export default NavLoginModal;