import React from 'react'
import { Modal, Button, Container } from 'react-bootstrap'

export default class InfoModal extends React.Component {
  render() {
    return (
      <Modal {...this.props}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">HOW TO PLAY</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            Guess the TWEARDLE in six tries.
            <hr />
            <h4 className="text-center w-100">ABOUT</h4>
            Inspired by Wordle, Heardle, Heardle-KPOP, BTS-Heardle.
          </Container>
        </Modal.Body>
      </Modal>
    )
  }
}
