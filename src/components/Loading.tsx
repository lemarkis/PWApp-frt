import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import loading from "../assets/loading.svg";

const Loading = () => (
    <Container fluid>
        <Row className="justify-content-center">
            <Col />
            <Col xs="auto">
                <img
                    src={loading}
                    alt="Loading"
                    width={100}
                />
            </Col>
            <Col />
        </Row>
    </Container>
);

export default Loading;
