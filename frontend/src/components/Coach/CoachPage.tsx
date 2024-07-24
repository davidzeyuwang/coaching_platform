import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import axios from '../api/axiosConfig';
import moment from 'moment-timezone';

const CoachPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [slots, setSlots] = useState<any[]>([]);
  const [slotDetails, setSlotDetails] = useState({ start_time: '', end_time: '', booked: false });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [coaches, setCoaches] = useState<any[]>([]);

  useEffect(() => {
    fetchSlots();
    fetchCoaches();
  }, [id]);


  const fetchCoaches = () => {
    axios.get(`/coaches`)
      .then(response => {
        setCoaches(response.data.coaches || []);
      })
      .catch(error => {
        console.error('Error fetching coaches:', error);
      });
  };

  const getCoachhName = (coach_id: string | undefined) => {
    if(coaches.length > 0 ){
      const coach = coaches.find((coach) => coach.id === Number(coach_id));
      return coach ? coach.name : 'N/A';
    }
  };


  const fetchSlots = () => {
    axios.get(`/slots?coach_id=${id}`).then(response => {
      setSlots(response.data.slots || []);
    }).catch(error => {
      console.error('Error fetching slots:', error);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'start_time') {
      const startTime = moment.tz(value, 'YYYY-MM-DDTHH:mm', 'UTC');
      const endTime = startTime.clone().add(2, 'hours');
      setSlotDetails({ ...slotDetails, start_time: value, end_time: endTime.format('YYYY-MM-DDTHH:mm') });
    } else {
      setSlotDetails({ ...slotDetails, [name]: value });
    }
  };

  const handleCreateSlot = () => {
    const startTimeUTC = moment.tz(slotDetails.start_time, 'YYYY-MM-DDTHH:mm', 'America/New_York').tz('UTC').format();
    const endTimeUTC = moment.tz(slotDetails.end_time, 'YYYY-MM-DDTHH:mm', 'America/New_York').tz('UTC').format();

    axios.post('/slots', { coach_id: id, start_time: startTimeUTC, end_time: endTimeUTC, booked: slotDetails.booked }).then(response => {
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
    const { name, value } = e.target;
    if (name === 'start_time') {
      const startTime = moment.tz(value, 'YYYY-MM-DDTHH:mm', 'UTC');
      const endTime = startTime.clone().add(2, 'hours');
      setSelectedSlot({ ...selectedSlot, start_time: value, end_time: endTime.format('YYYY-MM-DDTHH:mm') });
    } else {
      setSelectedSlot({ ...selectedSlot, [name]: value });
    }
  };

  const handleSaveSlot = () => {
    const startTimeUTC = moment.tz(selectedSlot.start_time, 'YYYY-MM-DDTHH:mm', 'America/New_York').tz('UTC').format();
    const endTimeUTC = moment.tz(selectedSlot.end_time, 'YYYY-MM-DDTHH:mm', 'America/New_York').tz('UTC').format();

    axios.put(`/slots/${selectedSlot.id}`, { ...selectedSlot, start_time: startTimeUTC, end_time: endTimeUTC }).then(response => {
      setSlots(slots.map((slot: any) => (slot.id === selectedSlot.id ? response.data : slot)));
      setShowEditModal(false);
    }).catch(error => {
      console.error('Error saving slot:', error);
    });
  };

  const handleAddNotes = (slot: any) => {
    setSelectedSlot(slot);
    setShowNotesModal(true);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedSlot({ ...selectedSlot, booking: { ...selectedSlot.booking, [name]: value } });
  };

  const handleSaveNotes = () => {
    axios.put(`/bookings/${selectedSlot.booking.id}`, { notes: selectedSlot.booking.notes, satisfaction: selectedSlot.booking.satisfaction }).then(response => {
      setSlots(slots.map((slot: any) => (slot.id === selectedSlot.id ? { ...slot, booking: response.data } : slot)));
      setShowNotesModal(false);
    }).catch(error => {
      console.error('Error saving notes:', error);
    });
  };

  const upcomingBookings = slots.filter(slot => slot.booked && moment(slot.start_time).isAfter(moment()));
  const notBookedSlots = slots.filter(slot => !slot.booked && moment(slot.start_time).isAfter(moment()));
  const pastBookings = slots.filter(slot => slot.booked && moment(slot.start_time).isBefore(moment()));

  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome {getCoachhName(id)} ☀️ </h1>
          <h2>Create Slot</h2>
          <Form>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="datetime-local" name="start_time" value={slotDetails.start_time} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <Form.Control type="datetime-local" name="end_time" value={slotDetails.end_time} disabled />
            </Form.Group>
            <br/>
            <div>
            <Button onClick={handleCreateSlot}>Create Slot</Button>
            </div>
            <br/>
          </Form>
          <div>
          <h2>Upcoming Bookings</h2>
          <ListGroup>
            {upcomingBookings.map((slot: any) => (
              <ListGroup.Item key={slot.id}>
                <p><strong>Start Time:</strong> {moment(slot.start_time).tz('America/New_York').format('YYYY-MM-DD hh:mm A')}</p>
                <p><strong>End Time:</strong> {moment(slot.end_time).tz('America/New_York').format('YYYY-MM-DD hh:mm A')}</p>
                <p><strong>Booked:</strong> {slot.booked ? 'Yes' : 'No'}</p>
                <Button variant="warning" onClick={() => handleEditSlot(slot)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteSlot(slot.id)}>Delete</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          </div>
          <br/>
          <div>
          <h2>Not Booked Slots</h2>
          <ListGroup>
            {notBookedSlots.map((slot: any) => (
              <ListGroup.Item key={slot.id}>
                <p><strong>Start Time:</strong> {moment(slot.start_time).tz('America/New_York').format('YYYY-MM-DD hh:mm A')}</p>
                <p><strong>End Time:</strong> {moment(slot.end_time).tz('America/New_York').format('YYYY-MM-DD hh:mm A')}</p>
                <Button variant="warning" onClick={() => handleEditSlot(slot)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteSlot(slot.id)}>Delete</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          </div>
          <br/>
          <div>
          <h2>Past Bookings</h2>
          <ListGroup>
            {pastBookings.map((slot: any) => (
              <ListGroup.Item key={slot.id}>
                <p><strong>Start Time:</strong> {moment(slot.start_time).tz('America/New_York').format('YYYY-MM-DD hh:mm A')}</p>
                <p><strong>End Time:</strong> {moment(slot.end_time).tz('America/New_York').format('YYYY-MM-DD hh:mm A')}</p>
                <p><strong>Booked:</strong> {slot.booked ? 'Yes' : 'No'}</p>
                <p><strong>Student:</strong> {slot.booking && slot.booking.student ? `${slot.booking.student.name} (ID: ${slot.booking.student.id}, Phone: ${slot.booking.student.phone_number})` : 'Not Booked'}</p>
                <Button variant="info" onClick={() => handleAddNotes(slot)}>Add Notes</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          </div>
        
        </Col>
      </Row>
      {selectedSlot && showEditModal && (
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
                <Form.Control type="datetime-local" name="end_time" value={selectedSlot.end_time} disabled />
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
      {selectedSlot && showNotesModal && (
        <Modal show={showNotesModal} onHide={() => setShowNotesModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" name="notes" value={selectedSlot.booking.notes || ''} onChange={handleNotesChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Satisfaction</Form.Label>
                <Form.Control type="number" name="satisfaction" value={selectedSlot.booking.satisfaction || ''} onChange={handleNotesChange} min="1" max="5" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default CoachPage;
