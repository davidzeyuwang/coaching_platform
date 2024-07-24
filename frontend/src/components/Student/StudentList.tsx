import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Alert, Pagination, Container, Row, Col } from 'react-bootstrap';
import axios from '../api/axiosConfig';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total_pages: 1, current_page: 1 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStudents(meta.current_page);
  }, [meta.current_page]);

  const fetchStudents = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/students?page=${page}`);
      setStudents(response.data.students || []);
      setMeta(response.data.meta || { total_pages: 1, current_page: page });
      setError(null);
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      setStudents([]);
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
          <h1>Students</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row>
              {students.map((student: any) => (
                <Col key={student.id} md={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/students/${student.id}`}>{student.name}</Link>
                      </Card.Title>
                      <Card.Text>
                        <strong>Phone:</strong> {student.phone_number}
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

export default StudentList;
