import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, ListGroup, Form } from 'react-bootstrap';
import axios from '../api/axiosConfig';
import moment from 'moment';

const StudentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    fetchBookings();
    fetchAvailableSlots();
    fetchAllSlots(); 
    fetchCoaches();
    fetchStudents(); 
  }, [id]);


  const fetchBookings = () => {
    axios.get(`/bookings?student_id=${id}`)
      .then(response => {
        console.log("fetch booking response:", response.data.bookings);
        setBookings(response.data.bookings || []);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  };

  const fetchAvailableSlots = () => {
    axios.get('/slots?booked=false').then(response => {
      setAvailableSlots(response.data.slots || []);
    }).catch(error => {
      console.error('Error fetching available slots:', error);
    });
  };

  const handleDeleteBooking = (bookingId: number, slot: any) => {
    axios.delete(`/bookings/${bookingId}`).then(() => {
      setBookings(bookings.filter((booking: any) => booking.id !== bookingId));
    }).catch(error => {
      console.error('Error deleting booking:', error);
    });
    updateTimeSlot(slot, "cancel");
  };

  const updateTimeSlot = (slot: any, action: String) => {
    const startTimeUTC = moment.tz(slot.start_time, 'YYYY-MM-DDTHH:mm', 'America/New_York').tz('UTC').format();
    const endTimeUTC = moment.tz(slot.end_time, 'YYYY-MM-DDTHH:mm', 'America/New_York').tz('UTC').format();
    const slotId = slot.id;

    const updateSlotData = {
      coach_id: slot.coach_id,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
      booked: action === "book" ? true : false
    };
    
    axios.patch(`http://localhost:3000/slots/${slotId}`, updateSlotData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if(action==="book"){
        setAvailableSlots(availableSlots.filter((sl: any) => sl.id !==slot.id));
      }
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error updating slot:', error);
    });
  }

  const handleBookSlot = (slot:any) => {
    axios.post('/bookings', { slot_id: slot.id, student_id: id }).then(response => {
      setBookings([...bookings, response.data]);
    }).catch(error => {
      console.error('Error booking slot:', error);
    });
    updateTimeSlot(slot, "book");
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const filterSlotsByDate = () => {
    axios.get(`/slots?start_time=${dateRange.start}&end_time=${dateRange.end}&booked=${false}`).then(response => {
      setAvailableSlots(response.data.slots || []);
    }).catch(error => {
      console.error('Error fetching slots:', error);
    });
  };

  const fetchAllSlots = () => {
    axios.get('/slots').then(response => {
      setTimeSlots(response.data.slots || []);
    }).catch(error => {
      console.error('Error fetching available slots:', error);
    });
  }

  const getSlot = (slot_id: any) => {
    return timeSlots.find((ts: any) => ts.id === slot_id);
  }

  const fetchCoaches = () => {
    axios.get(`/coaches`)
      .then(response => {
        setCoaches(response.data.coaches || []);
      })
      .catch(error => {
        console.error('Error fetching coaches:', error);
      });
  };

  const fetchStudents = () => {
    axios.get(`/students`)
      .then(response => {
        setStudents(response.data.students || []);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  };

  const getCoachNumber = (coach_id: number) => {
    if(coaches.length > 0 ){
      const coach = coaches.find((coach) => coach.id === coach_id);
      return coach ? coach.phone_number : 'N/A';
    }
  };

  const getCoachhName = (coach_id: number) => {
    if(coaches.length > 0 ){
      const coach = coaches.find((coach) => coach.id === coach_id);
      return coach ? coach.name : 'N/A';
    }
  };

  const getStudentName = (student_id: string | undefined) => {
    if(students.length > 0){
      const student = students.find((stu) => stu.id === Number(student_id));
      return student ? student.name : 'N/A';
    }
  }
  
  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome: {getStudentName(id)} ☀️ </h1>
          <h2>Your Bookings</h2>
          <ListGroup>
            {bookings.map((booking: any) => {
              const slot = getSlot(booking.slot_id);
              return (
                slot ? (
                  <ListGroup.Item key={booking.id}>
                      <p><strong>Slot ID:</strong> {booking.slot_id}</p>
                      <p><strong>Start Time:</strong> {new Date(slot.start_time).toLocaleString()}</p>
                      <p><strong>End Time:</strong> {new Date(slot.end_time).toLocaleString()}</p>
                      <p><strong>Coach:</strong> {getCoachhName(slot.coach_id)}</p>
                      <p><strong>Coach ID:</strong> {slot.coach_id}</p>
                      <p><strong>Coach Contact:</strong> {getCoachNumber(slot.coach_id)}</p>
                      <p><strong>Satisfaction:</strong> {booking.satisfaction}</p>
                      <p><strong>Coach Notes:</strong> {booking.notes}</p>
                    <div>
                      <Button variant="danger" onClick={() => handleDeleteBooking(booking.id, slot)}>Cancel</Button>
                    </div>
                  </ListGroup.Item>
                ) : null
              )
            })}
          </ListGroup>
          <h2>Available Slots</h2>
          <Form>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="datetime-local" name="start" value={dateRange.start} onChange={handleDateRangeChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="datetime-local" name="end" value={dateRange.end} onChange={handleDateRangeChange} />
            </Form.Group>
            <br/>
            <div>
            <Button variant="primary" onClick={filterSlotsByDate}>Filter Slots</Button>
            </div>
            <br/>
            
          </Form>
          <ListGroup>
            {availableSlots.map((slot: any) => (
              <ListGroup.Item key={slot.id}>
                <p><strong> Coach:</strong> {getCoachhName(slot.coach_id)}</p>
                <p><strong> Coach ID:</strong> {slot.coach_id}</p>
                <p><strong>Start Time:</strong> {new Date(slot.start_time).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(slot.end_time).toLocaleString()}</p>
                <div>
                <Button variant="primary" onClick={() => handleBookSlot(slot)}>Book</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentPage;
