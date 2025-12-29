import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

function Home() {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/flights?origin=${searchData.origin}&destination=${searchData.destination}&date=${searchData.date}`);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '80vh',
      paddingTop: '50px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center text-white mb-5">
              <h1 className="display-3 fw-bold mb-3">✈️ Book Your Flight</h1>
              <p className="lead">Find and book the best flights at the lowest prices</p>
            </div>

            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <h3 className="text-center mb-4">Search Flights</h3>
                
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-bold">From</Form.Label>
                        <Form.Control
                          type="text"
                          size="lg"
                          placeholder="Origin city (e.g., New York)"
                          value={searchData.origin}
                          onChange={(e) => setSearchData({...searchData, origin: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="fw-bold">To</Form.Label>
                        <Form.Control
                          type="text"
                          size="lg"
                          placeholder="Destination city (e.g., Los Angeles)"
                          value={searchData.destination}
                          onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Form.Group>
                        <Form.Label className="fw-bold">Departure Date</Form.Label>
                        <Form.Control
                          type="date"
                          size="lg"
                          value={searchData.date}
                          onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="w-100"
                  >
                    🔍 Search Flights
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-2">Or browse all available flights</p>
                  <Button 
                    variant="outline-primary"
                    onClick={() => navigate('/browse-flights')}
                  >
                    Browse All Flights →
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Features Section */}
            <Row className="mt-5 text-white">
              <Col md={4} className="text-center mb-3">
                <div className="fs-1 mb-2">💰</div>
                <h5>Best Prices</h5>
                <p className="small">Compare prices from multiple airlines</p>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="fs-1 mb-2">⚡</div>
                <h5>Instant Booking</h5>
                <p className="small">Book flights in seconds</p>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="fs-1 mb-2">🎫</div>
                <h5>Easy Management</h5>
                <p className="small">Manage bookings with ease</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;