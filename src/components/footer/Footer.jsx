import React from "react";
import { Nav } from "react-bootstrap";

const Footer = () => {
  return (
    <Nav className="justify-content-end fixed-bottom" activeKey="/home">
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Christian Fernández
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          React JavaScript BootStrap Async Away Axios
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Footer;
