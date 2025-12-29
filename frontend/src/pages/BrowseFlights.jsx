import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';

function BrowseFlights() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    maxPrice: '',
    sortBy: 'price'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, flights]);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flights');
      setFlights(response.data);
      setFilteredFlights(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...flights];

    if (filters.origin) {
      filtered = filtered.filter(f => 
        f.origin.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter(f => 
        f.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(f => f.price <= parseFloat(filters.maxPrice));
    }

    if (filters.sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'departure') {
      filtered.sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime));
    } else if (filters.sortBy === 'airline') {
      filtered.sort((a, b) => a.airlineName.localeCompare(b.airlineName));
    }

    setFilteredFlights(filtered);
  };

  const clearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      maxPrice: '',
      sortBy: 'price'
    });
  };

  const handleBookFlight = (flightId) => {
    navigate(`/booking/${flightId}`);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading flights...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Browse Available Flights</h2>
      
      {/* Filters Panel */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">🔍 Search & Filter</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Origin</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., New York"
                  value={filters.origin}
                  onChange={(e) => setFilters({...filters, origin: e.target.value})}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., London"
                  value={filters.destination}
                  onChange={(e) => setFilters({...filters, destination: e.target.value})}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Max Price ($)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="departure">Departure Time</option>
                  <option value="airline">Airline Name</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center">
            <Button variant="outline-secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Badge bg="info" className="fs-6">
              Showing {filteredFlights.length} of {flights.length} flights
            </Badge>
          </div>
        </Card.Body>
      </Card>

      {/* Flights List */}
      {filteredFlights.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No flights found</h4>
            <p className="text-muted">Try adjusting your filters</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredFlights.map(flight => (
            <Col md={12} key={flight.id} className="mb-3">
              <Card className="shadow-sm h-100 hover-shadow" style={{ transition: 'transform 0.2s' }}>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="mb-0 me-3">{flight.airlineName}</h4>
                        <Badge bg="secondary">{flight.flightNumber}</Badge>
                      </div>
                      
                      <Row className="mt-3">
                        <Col md={4}>
                          <small className="text-muted">From</small>
                          <h5 className="mb-0">{flight.origin}</h5>
                          <small>{new Date(flight.departureDateTime).toLocaleString()}</small>
                        </Col>
                        <Col md={4} className="text-center">
                          <small className="text-muted">Duration</small>
                          <h6 className="mb-0">→ {flight.duration || 'N/A'} →</h6>
                        </Col>
                        <Col md={4}>
                          <small className="text-muted">To</small>
                          <h5 className="mb-0">{flight.destination}</h5>
                          <small>{new Date(flight.arrivalDateTime).toLocaleString()}</small>
                        </Col>
                      </Row>

                      <div className="mt-3">
                        <Badge bg="success" className="me-2">
                          {flight.availableSeats} seats available
                        </Badge>
                        <Badge bg="info">
                          {flight.status}
                        </Badge>
                      </div>
                    </Col>

                    <Col md={4} className="text-end">
                      <h2 className="text-primary mb-3">${flight.price}</h2>
                      <Button 
                        variant="success" 
                        size="lg"
                        onClick={() => handleBookFlight(flight.id)}
                        className="w-100"
                      >
                        Book Now →
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default BrowseFlights;