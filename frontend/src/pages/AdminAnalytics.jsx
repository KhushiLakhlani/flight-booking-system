import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { decodeToken } from '../utils/auth';

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [revenueByFlight, setRevenueByFlight] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [occupancyRates, setOccupancyRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    const decoded = decodeToken(token);
    if (decoded?.role !== 'ADMIN') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, revenueRes, routesRes, occupancyRes] = await Promise.all([
        axios.get('http://localhost:8080/api/analytics/stats'),
        axios.get('http://localhost:8080/api/analytics/revenue-by-flight'),
        axios.get('http://localhost:8080/api/analytics/popular-routes'),
        axios.get('http://localhost:8080/api/analytics/occupancy-rates')
      ]);

      setStats(statsRes.data);
      setRevenueByFlight(revenueRes.data);
      setPopularRoutes(routesRes.data);
      setOccupancyRates(occupancyRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading analytics...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">📊 Analytics Dashboard</h2>

      {/* Overall Statistics Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center shadow-sm bg-primary text-white">
              <Card.Body>
                <h6 className="text-uppercase mb-2">Total Revenue</h6>
                <h2 className="mb-0">${stats.totalRevenue.toFixed(2)}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center shadow-sm bg-success text-white">
              <Card.Body>
                <h6 className="text-uppercase mb-2">Total Bookings</h6>
                <h2 className="mb-0">{stats.totalBookings}</h2>
                <small>({stats.confirmedBookings} confirmed)</small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center shadow-sm bg-info text-white">
              <Card.Body>
                <h6 className="text-uppercase mb-2">Total Customers</h6>
                <h2 className="mb-0">{stats.totalCustomers}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center shadow-sm bg-warning text-white">
              <Card.Body>
                <h6 className="text-uppercase mb-2">Avg Booking Value</h6>
                <h2 className="mb-0">${stats.averageBookingValue.toFixed(2)}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Revenue by Flight */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">💰 Revenue by Flight</h5>
        </Card.Header>
        <Card.Body>
          {revenueByFlight.length === 0 ? (
            <p className="text-muted">No booking data available</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Flight</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenueByFlight.map((item, index) => (
                  <tr key={item.flightId}>
                    <td>{index + 1}</td>
                    <td><Badge bg="secondary">{item.flightNumber}</Badge></td>
                    <td>{item.airlineName}</td>
                    <td>{item.route}</td>
                    <td><Badge bg="info">{item.bookings}</Badge></td>
                    <td className="fw-bold text-success">${item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Popular Routes */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">🔥 Top 5 Popular Routes</h5>
            </Card.Header>
            <Card.Body>
              {popularRoutes.length === 0 ? (
                <p className="text-muted">No route data available</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Bookings</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularRoutes.map((route, index) => (
                      <tr key={index}>
                        <td>
                          <Badge bg="primary" className="me-2">{index + 1}</Badge>
                          {route.route}
                        </td>
                        <td><Badge bg="info">{route.bookings}</Badge></td>
                        <td className="text-success fw-bold">${route.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Occupancy Rates */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">📈 Flight Occupancy Rates</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {occupancyRates.length === 0 ? (
                <p className="text-muted">No occupancy data available</p>
              ) : (
                occupancyRates.map((flight, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-bold">
                        {flight.flightNumber} - {flight.route}
                      </small>
                      <small className="text-muted">
                        {flight.bookedSeats}/{flight.totalSeats} seats
                      </small>
                    </div>
                    <ProgressBar 
                      now={flight.occupancyRate} 
                      label={`${flight.occupancyRate}%`}
                      variant={
                        flight.occupancyRate >= 80 ? 'success' : 
                        flight.occupancyRate >= 50 ? 'warning' : 'danger'
                      }
                    />
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Stats */}
      {stats && (
        <Card className="shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">📋 Summary Statistics</h5>
          </Card.Header>
          <Card.Body>
            <Row className="text-center">
              <Col md={4}>
                <h3 className="text-primary">{stats.totalFlights}</h3>
                <p className="text-muted mb-0">Total Flights</p>
              </Col>
              <Col md={4}>
                <h3 className="text-success">{stats.confirmedBookings}</h3>
                <p className="text-muted mb-0">Confirmed Bookings</p>
              </Col>
              <Col md={4}>
                <h3 className="text-danger">{stats.cancelledBookings}</h3>
                <p className="text-muted mb-0">Cancelled Bookings</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default AdminAnalytics;