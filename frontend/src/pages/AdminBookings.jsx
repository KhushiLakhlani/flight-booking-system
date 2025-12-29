import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decodeToken } from '../utils/auth';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [bookingsWithDetails, setBookingsWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'ALL',
    searchReference: ''
  });
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

    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      // Fetch all bookings
      const bookingsResponse = await axios.get('http://localhost:8080/api/bookings');
      const bookingsData = bookingsResponse.data;
      
      // Fetch user and flight details for each booking
      const bookingsWithAllDetails = await Promise.all(
        bookingsData.map(async (booking) => {
          try {
            const [userResponse, flightResponse] = await Promise.all([
              axios.get(`http://localhost:8080/api/users/${booking.userId}`),
              axios.get(`http://localhost:8080/api/flights/${booking.flightId}`)
            ]);
            
            return {
              ...booking,
              user: userResponse.data,
              flight: flightResponse.data
            };
          } catch (error) {
            console.error(`Error fetching details for booking ${booking.id}:`, error);
            return {
              ...booking,
              user: null,
              flight: null
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

  const filteredBookings = bookingsWithDetails.filter(booking => {
    // Filter by status
    if (filter.status !== 'ALL' && booking.status !== filter.status) {
      return false;
    }
    
    // Filter by booking reference
    if (filter.searchReference && !booking.bookingReference.toLowerCase().includes(filter.searchReference.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Calculate statistics
  const stats = {
    total: bookingsWithDetails.length,
    confirmed: bookingsWithDetails.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookingsWithDetails.filter(b => b.status === 'CANCELLED').length,
    totalRevenue: bookingsWithDetails
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.totalPrice, 0)
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '50px auto', padding: '20px' }}>
      <h2>Admin - All Bookings Management</h2>
      
      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{stats.total}</h3>
          <p style={{ margin: 0 }}>Total Bookings</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{stats.confirmed}</h3>
          <p style={{ margin: 0 }}>Confirmed</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{stats.cancelled}</h3>
          <p style={{ margin: 0 }}>Cancelled</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffc107', 
          color: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>${stats.totalRevenue.toFixed(2)}</h3>
          <p style={{ margin: 0 }}>Total Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Filter by Status:</label>
            <select 
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="ALL">All Bookings</option>
              <option value="CONFIRMED">Confirmed Only</option>
              <option value="CANCELLED">Cancelled Only</option>
            </select>
          </div>

          <div>
            <label>Search by Reference:</label>
            <input 
              type="text" 
              placeholder="Enter booking reference"
              value={filter.searchReference}
              onChange={(e) => setFilter({...filter, searchReference: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>
        
        <p style={{ marginTop: '15px', color: '#666' }}>
          Showing {filteredBookings.length} of {bookingsWithDetails.length} bookings
        </p>
      </div>

      {/* Bookings Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Reference</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Flight</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Route</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Seat</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <strong>{booking.bookingReference}</strong>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {booking.user ? (
                    <>
                      {booking.user.firstName} {booking.user.lastName}
                      <br />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {booking.user.email}
                      </span>
                    </>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {booking.flight ? (
                    <>
                      {booking.flight.airlineName}
                      <br />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {booking.flight.flightNumber}
                      </span>
                    </>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {booking.flight ? (
                    `${booking.flight.origin} → ${booking.flight.destination}`
                  ) : (
                    'N/A'
                  )}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {booking.seatNumber}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  ${booking.totalPrice}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: booking.status === 'CONFIRMED' ? '#d4edda' : '#f8d7da',
                    color: booking.status === 'CONFIRMED' ? '#155724' : '#721c24'
                  }}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No bookings found matching your filters.
        </p>
      )}
    </div>
  );
}

export default AdminBookings;