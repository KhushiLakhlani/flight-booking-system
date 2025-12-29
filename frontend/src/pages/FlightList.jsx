import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function FlightList() {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flights');
      // Filter flights based on search params
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');
      
      const filtered = response.data.filter(flight => 
        flight.origin.toLowerCase().includes(origin.toLowerCase()) &&
        flight.destination.toLowerCase().includes(destination.toLowerCase())
      );
      
      setFlights(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setLoading(false);
    }
  };

  const handleBookFlight = (flightId) => {
    navigate(`/booking/${flightId}`);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading flights...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
      <h2>Available Flights</h2>
      <p>From: {searchParams.get('origin')} → To: {searchParams.get('destination')}</p>
      
      {flights.length === 0 ? (
        <p>No flights found for this route.</p>
      ) : (
        <div>
          {flights.map(flight => (
            <div key={flight.id} style={{ 
              border: '1px solid #ddd', 
              padding: '20px', 
              marginBottom: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{flight.airlineName} - {flight.flightNumber}</h3>
                  <p><strong>{flight.origin}</strong> → <strong>{flight.destination}</strong></p>
                  <p>Departure: {new Date(flight.departureDateTime).toLocaleString()}</p>
                  <p>Arrival: {new Date(flight.arrivalDateTime).toLocaleString()}</p>
                  <p>Duration: {flight.duration || 'N/A'}</p>
                  <p>Available Seats: {flight.availableSeats}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ color: '#007bff' }}>${flight.price}</h2>
                  <button 
                    onClick={() => handleBookFlight(flight.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FlightList;