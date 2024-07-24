import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import axios from '../api/axiosConfig';

const CoachPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [slots, setSlots] = useState<any[]>([]);
  const [slotDetails, setSlotDetails] = useState({ start_time: '', end_time: '', booked: false });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  useEffect(() => {
    fetchSlots();
  }, [id]);

  const fetchSlots = () => {
    axios.get(`/slots?coach_id=${id}`).then(response => {
      setSlots(response.data.slots || []);
    }).catch(error => {
      console.error('Error fetching slots:', error);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlotDetails({ ...slotDetails, [e.target.name]: e.target.value });
  };

  const handleCreateSlot = () => {
    axios.post('/slots', { coach_id: id, ...slotDetails }).then(response => {
      setSlots([...slots, response.data]);
      setSlotDetails({ start_time: '', end_time: '', booked: false });
    }).catch(error => {
      console.error('Error creating slot:', error);
    });
  };

  const handleDeleteSlot = (slotId: number) => {
    axios.delete(`/slots/${slotId}`).then(() => {
      setSlots(slots.filter((slot: any) => slot.id !== slotId));
    }).catch(error => {
      console.error('Error deleting slot:', error);
    });
  };

  const handleEditSlot = (slot: any) => {
    setSelectedSlot(slot);
    setShowEditModal(true);
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSlot({ ...selectedSlot, [e.target.name]: e.target.value });
  };

  const handleSaveSlot = () => {
    axios.put(`/slots/${selectedSlot.id}`, selectedSlot).then(response => {
      setSlots(slots.map((slot: any) => (slot.id === selectedSlot.id ? response.data : slot)));
      setShowEditModal(false);
    }).catch(error => {
      console.error('Error saving slot:', error);
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Coach {id}</h1>
          <h2>Create Slot</h2>
          <Form>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="datetime-local" name="start_time" value={slotDetails.start_time} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <Form.Control type="datetime-local" name="end_time" value={slotDetails.end_time} onChange={handleInputChange} />
            </Form.Group>
            <Button onClick={handleCreateSlot}>Create Slot</Button>
          </Form>
          <h2>Your Slots</h2>
          <ListGroup>
            {slots.map((slot: any) => (
              <ListGroup.Item key={slot.id}>
                <p><strong>Start Time:</strong> {new Date(slot.start_time).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(slot.end_time).toLocaleString()}</p>
                <p><strong>Booked:</strong> {slot.booked ? 'Yes' : 'No'}</p>
                <p><strong>Student:</strong> {slot.booking && slot.booking.student ? `${slot.booking.student.name} (ID: ${slot.booking.student.id}, Phone: ${slot.booking.student.phone_number})` : 'Not Booked'}</p>
                <Button variant="warning" onClick={() => handleEditSlot(slot)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteSlot(slot.id)}>Delete</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      {selectedSlot && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Slot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Start Time</Form.Label>
                <Form.Control type="datetime-local" name="start_time" value={selectedSlot.start_time} onChange={handleSlotChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>End Time</Form.Label>
                <Form.Control type="datetime-local" name="end_time" value={selectedSlot.end_time} onChange={handleSlotChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveSlot}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default CoachPage;
