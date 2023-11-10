import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand href="#home">ISS Tracker</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
