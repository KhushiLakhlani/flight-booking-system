import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import Home from './pages/Home';
import FlightList from './pages/FlightList';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminAnalytics from './pages/AdminAnalytics';
import BrowseFlights from './pages/BrowseFlights';
import UserProfile from './pages/UserProfile';
import { decodeToken } from './utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = token ? decodeToken(token)?.role : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          ✈️ Flight Booking
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userRole === 'ADMIN' ? (
              // Admin links
              <>
                <Nav.Link onClick={() => navigate('/admin')} style={{ color: 'white' }}>
                  Flight Management
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/bookings')} style={{ color: 'white' }}>
                  All Bookings
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/analytics')} style={{ color: 'white' }}>
                  Analytics
                </Nav.Link>
              </>
            ) : (
              // Customer links
              <>
                <Nav.Link onClick={() => navigate('/')} style={{ color: 'white' }}>
                  Home
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/browse-flights')} style={{ color: 'white' }}>
                  Browse Flights
                </Nav.Link>
                {token && (
                  <>
                    <Nav.Link onClick={() => navigate('/my-bookings')} style={{ color: 'white' }}>
                      My Bookings
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate('/profile')} style={{ color: 'white' }}>
                      Profile
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {token && (
              <Badge 
                bg={userRole === 'ADMIN' ? 'danger' : 'success'} 
                className="me-3 align-self-center"
                style={{ fontSize: '0.9rem', padding: '8px 12px' }}
              >
                {userRole}
              </Badge>
            )}
            
            {!token ? (
              <>
                <Button 
                  variant="outline-light" 
                  className="me-2"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="light"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            ) : (
              <Button 
                variant="outline-light"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse-flights" element={<BrowseFlights />} />
          <Route path="/flights" element={<FlightList />} />
          <Route path="/booking/:flightId" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;