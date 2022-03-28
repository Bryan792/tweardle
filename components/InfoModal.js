import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class InfoModal extends React.Component {
  render() {
    return (
      <Modal {...this.props}>
        <Modal.Header closeButton>
          <Modal.Title>HOW TO PLAY</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Guess the TWEARDLE in six tries.
        <hr />
          <h3>ABOUT</h3>
          Inspired by Wordle, Heardle, Heardle-KPOOP, BTS-Heardle.
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    )
  }
}
