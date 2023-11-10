import React from "react";
import Header from "../src/components/header/Header";
import Body from "../src/components/body/Body";
import Footer from "../src/components/footer/Footer";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <Container>
      <Header />
      <Body />
      <Footer />
    </Container>
  );
};

export default App;
