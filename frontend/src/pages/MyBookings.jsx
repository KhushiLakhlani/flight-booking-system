import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getUserId, isAuthenticated } from '../utils/auth';

function MyBookings() {
  const [bookingsWithDetails, setBookingsWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to view your bookings');
      navigate('/login');
      return;
    }
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = getUserId();
      
      if (!userId) {
        alert('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      const bookingsResponse = await axios.get(`http://localhost:8080/api/bookings/user/${userId}`);
      const bookingsData = bookingsResponse.data;
      
      const bookingsWithAllDetails = await Promise.all(
        bookingsData.map(async (booking) => {
          try {
            const [flightResponse, passengersResponse] = await Promise.all([
              axios.get(`http://localhost:8080/api/flights/${booking.flightId}`),
              axios.get(`http://localhost:8080/api/passengers/booking/${booking.id}`)
            ]);
            
            return {
              ...booking,
              flight: flightResponse.data,
              passengers: passengersResponse.data
            };
          } catch (error) {
            console.error(`Error fetching details for booking ${booking.id}:`, error);
            return {
              ...booking,
              flight: null,
              passengers: []
            };
          }
        })
      );
      
      setBookingsWithDetails(bookingsWithAllDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">My Bookings</h2>
      
      {bookingsWithDetails.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <div className="mb-4" style={{ fontSize: '4rem' }}>✈️</div>
            <h4>No bookings yet</h4>
            <p className="text-muted">You haven't made any flight bookings</p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/browse-flights')}
              className="mt-3"
            >
              Browse Flights
            </Button>
          </Card.Body>
        </Card>
      ) : (
        bookingsWithDetails.map(booking => (
          <Card key={booking.id} className="mb-4 shadow-sm">
            <Card.Header className={booking.status === 'CONFIRMED' ? 'bg-success text-white' : 'bg-secondary text-white'}>
              <Row className="align-items-center">
                <Col>
                  <Badge bg={booking.status === 'CONFIRMED' ? 'light' : 'dark'} text="dark" className="me-2">
                    {booking.status}
                  </Badge>
                  <span className="fw-bold">Ref: {booking.bookingReference}</span>
                </Col>
                <Col className="text-end">
                  <Badge bg="primary" className="fs-6">
                    {booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}
                  </Badge>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body>
              {booking.flight ? (
                <>
                  <Row className="mb-3">
                    <Col>
                      <h4 className="mb-3">
                        {booking.flight.airlineName} - {booking.flight.flightNumber}
                      </h4>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={3}>
                      <small className="text-muted">Route</small>
                      <h6 className="fw-bold">{booking.flight.origin} → {booking.flight.destination}</h6>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">Departure</small>
                      <h6>{new Date(booking.flight.departureDateTime).toLocaleString()}</h6>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">Arrival</small>
                      <h6>{new Date(booking.flight.arrivalDateTime).toLocaleString()}</h6>
                    </Col>
                    <Col md={3}>
                      <small className="text-muted">Duration</small>
                      <h6>{booking.flight.duration || 'N/A'}</h6>
                    </Col>
                  </Row>

                  {/* Passengers */}
                  {booking.passengers && booking.passengers.length > 0 && (
                    <Card className="bg-light mb-3">
                      <Card.Body>
                        <h6 className="mb-3">Passengers:</h6>
                        <Row>
                          {booking.passengers.map((passenger, index) => (
                            <Col md={6} key={passenger.id} className="mb-3">
                              <Card className="border">
                                <Card.Body className="p-3">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <h6 className="mb-1">
                                        {passenger.firstName} {passenger.lastName}
                                      </h6>
                                      <small className="text-muted d-block">
                                        {passenger.gender} • DOB: {new Date(passenger.dateOfBirth).toLocaleDateString()}
                                      </small>
                                    </div>
                                    <div className="text-end">
                                      <Badge bg="info">Seat {passenger.seatNumber}</Badge>
                                      <small className="d-block mt-1 text-muted">
                                        {passenger.mealPreference}
                                      </small>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  )}
                </>
              ) : (
                <Alert variant="warning">Flight details not available</Alert>
              )}

              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    <Badge bg="primary" className="fs-6">Total: ${booking.totalPrice}</Badge>
                  </h5>
                  <small className="text-muted">
                    Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                  </small>
                </Col>
                <Col className="text-end">
                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      variant="danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default MyBookings;