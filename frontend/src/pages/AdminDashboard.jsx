import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decodeToken } from '../utils/auth';

function AdminDashboard() {
  const [flights, setFlights] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFlight, setNewFlight] = useState({
    flightNumber: '',
    airlineName: '',
    origin: '',
    destination: '',
    departureDateTime: '',
    arrivalDateTime: '',
    duration: '',
    price: '',
    totalSeats: '',
    availableSeats: ''
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

    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flights');
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:8080/api/flights', {
        ...newFlight,
        price: parseFloat(newFlight.price),
        totalSeats: parseInt(newFlight.totalSeats),
        availableSeats: parseInt(newFlight.availableSeats)
      });
      
      alert('Flight added successfully!');
      setShowAddForm(false);
      setNewFlight({
        flightNumber: '',
        airlineName: '',
        origin: '',
        destination: '',
        departureDateTime: '',
        arrivalDateTime: '',
        duration: '',
        price: '',
        totalSeats: '',
        availableSeats: ''
      });
      fetchFlights();
    } catch (error) {
      console.error('Error adding flight:', error);
      alert('Failed to add flight');
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/flights/${flightId}`);
      alert('Flight deleted successfully!');
      fetchFlights();
    } catch (error) {
      console.error('Error deleting flight:', error);
      alert('Failed to delete flight');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <h2>Admin Dashboard - Flight Management</h2>
      
      <button 
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showAddForm ? 'Cancel' : 'Add New Flight'}
      </button>

      {/* Add Flight Form */}
      {showAddForm && (
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Add New Flight</h3>
          <form onSubmit={handleAddFlight}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Flight Number:</label>
                <input 
                  type="text" 
                  value={newFlight.flightNumber}
                  onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Airline Name:</label>
                <input 
                  type="text" 
                  value={newFlight.airlineName}
                  onChange={(e) => setNewFlight({...newFlight, airlineName: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Origin:</label>
                <input 
                  type="text" 
                  value={newFlight.origin}
                  onChange={(e) => setNewFlight({...newFlight, origin: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Destination:</label>
                <input 
                  type="text" 
                  value={newFlight.destination}
                  onChange={(e) => setNewFlight({...newFlight, destination: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Departure Date & Time:</label>
                <input 
                  type="datetime-local" 
                  value={newFlight.departureDateTime}
                  onChange={(e) => setNewFlight({...newFlight, departureDateTime: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Arrival Date & Time:</label>
                <input 
                  type="datetime-local" 
                  value={newFlight.arrivalDateTime}
                  onChange={(e) => setNewFlight({...newFlight, arrivalDateTime: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Duration (e.g., 5h 30m):</label>
                <input 
                  type="text" 
                  value={newFlight.duration}
                  onChange={(e) => setNewFlight({...newFlight, duration: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Price ($):</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={newFlight.price}
                  onChange={(e) => setNewFlight({...newFlight, price: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Total Seats:</label>
                <input 
                  type="number" 
                  value={newFlight.totalSeats}
                  onChange={(e) => setNewFlight({...newFlight, totalSeats: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Available Seats:</label>
                <input 
                  type="number" 
                  value={newFlight.availableSeats}
                  onChange={(e) => setNewFlight({...newFlight, availableSeats: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>

            <button 
              type="submit"
              style={{
                marginTop: '15px',
                padding: '10px 30px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Flight
            </button>
          </form>
        </div>
      )}

      {/* Flights List */}
      <h3>All Flights</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Flight No.</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Airline</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Route</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Departure</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Price</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Seats</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{flight.flightNumber}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{flight.airlineName}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {flight.origin} → {flight.destination}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {new Date(flight.departureDateTime).toLocaleString()}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>${flight.price}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {flight.availableSeats}/{flight.totalSeats}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button 
                  onClick={() => handleDeleteFlight(flight.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;