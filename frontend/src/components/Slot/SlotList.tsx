import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';

const SlotList: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total_pages: 1, current_page: 1 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots(meta.current_page);
  }, [meta.current_page]);

  const fetchSlots = async (page: number) => {
    try {
      const response = await axios.get(`/slots?page=${page}`);
      setSlots(response.data.slots || []);
      setMeta(response.data.meta || { total_pages: 1, current_page: page });
      setError(null);
    } catch (err) {
      setError('Failed to fetch slots. Please try again later.');
      setSlots([]);
      setMeta({ total_pages: 1, current_page: page });
    }
  };

  const handlePageChange = (newPage: number) => {
    setMeta({ ...meta, current_page: newPage });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Slots</h1>
          {error && <p>{error}</p>}
          <ListGroup>
            {slots.map((slot: any) => (
              <ListGroup.Item key={slot.id}>
                <p><strong>Start Time:</strong> {new Date(slot.start_time).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(slot.end_time).toLocaleString()}</p>
                <p><strong>Coach:</strong> {slot.coach ? `${slot.coach.name} (ID: ${slot.coach.id}, Phone: ${slot.coach.phone_number})` : 'Unknown'}</p>
                <p><strong>Student:</strong> {slot.booking && slot.booking.student ? `${slot.booking.student.name} (ID: ${slot.booking.student.id}, Phone: ${slot.booking.student.phone_number})` : 'Not Booked'}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div>
            {Array.from({ length: meta.total_pages }, (_, index) => (
              <Button key={index + 1} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SlotList;
