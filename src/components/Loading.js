import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import loading from "../assets/loading.svg";

const Loading = () => (
  <Container fluid>
    <Row className="justify-content-md-center">
      <Col xs="5">
        <img
          src={loading}
          alt="Loading"
          className="img-fluid w-50 mx-auto"
          width={50}
        />
      </Col>
    </Row>
  </Container>
);

export default Loading;
