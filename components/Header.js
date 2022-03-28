import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons'

export default class Header extends React.Component {
  render() {
    return (
      <Navbar className="bg-dark">
        <Container>
          <Icon.InfoCircleFill
            role="button"
            size={24}
            onClick={this.props.onClickInfo}
          />
          <Navbar.Brand href="/" className="mx-auto text-white">
            <img
              alt=""
              src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Logo_of_TWICE.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            eardle
          </Navbar.Brand>
          <Icon.BarChartFill
            role="button"
            size={24}
            onClick={this.props.onClickStats}
          />
        </Container>
      </Navbar>
    )
  }
}
