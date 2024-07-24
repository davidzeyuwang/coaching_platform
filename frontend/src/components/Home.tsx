import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Home: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to Stepful Coaching Management</h1>
          <LinkContainer to="/coaches">
            <Button variant="primary" className="m-2">Coaches</Button>
          </LinkContainer>
          <LinkContainer to="/students">
            <Button variant="secondary" className="m-2">Students</Button>
          </LinkContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
