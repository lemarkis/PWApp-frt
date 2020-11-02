import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import useApi from '../utils/useApi';

const Test = () => {
  const directApi = useApi(false);
  const authedApi = useApi();

  const publicPing = () => {
    directApi.get("/test/publicPing").then(res => alert(res.data)).catch(err => alert(err));
  }

  const privatePing = () => {
    authedApi.get("/test/privatePing").then(res => alert(res.data)).catch(err => alert(err));
  }

  return (
    <Row className="justify-content-center">
      <Col xs="auto" />
      <Col md="4">
        <Button block id="publicPing" onClick={() => publicPing()}>Test publicPing</Button>
        <Button block id="privatePing" onClick={() => privatePing()}>Test privatePing</Button>
      </Col>
      <Col xs="auto" />
    </Row>
  );
};

export default Test;