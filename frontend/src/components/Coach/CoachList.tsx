import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Alert, Pagination, Container, Row, Col } from 'react-bootstrap';
import axios from '../api/axiosConfig';

const CoachList: React.FC = () => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total_pages: 1, current_page: 1 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCoaches(meta.current_page);
  }, [meta.current_page]);

  const fetchCoaches = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/coaches?page=${page}`);
      setCoaches(response.data.coaches || []);
      setMeta(response.data.meta || { total_pages: 1, current_page: page });
      setError(null);
    } catch (err) {
      setError('Failed to fetch coaches. Please try again later.');
      setCoaches([]);
      setMeta({ total_pages: 1, current_page: page });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setMeta({ ...meta, current_page: newPage });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Coaches</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row>
              {coaches.map((coach: any) => (
                <Col key={coach.id} md={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/coaches/${coach.id}`}>{coach.name}</Link>
                      </Card.Title>
                      <Card.Text>
                        <strong>Phone:</strong> {coach.phone_number}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          <Pagination>
            {Array.from({ length: meta.total_pages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === meta.current_page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default CoachList;
