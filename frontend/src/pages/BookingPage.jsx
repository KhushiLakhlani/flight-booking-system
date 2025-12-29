import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserId, isAuthenticated } from '../utils/auth';

function BookingPage() {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState([{
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    passportNumber: '',
    nationality: '',
    seatNumber: '',
    mealPreference: 'NONE',
    specialAssistance: 'NONE'
  }]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to book a flight');
      navigate('/login');
      return;
    }
    
    fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/flights/${flightId}`);
      setFlight(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flight:', error);
      setLoading(false);
    }
  };

  const handleNumPassengersChange = (num) => {
    const newNum = parseInt(num);
    setNumPassengers(newNum);
    
    // Add or remove passenger forms
    if (newNum > passengers.length) {
      const newPassengers = [...passengers];
      for (let i = passengers.length; i < newNum; i++) {
        newPassengers.push({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: 'MALE',
          passportNumber: '',
          nationality: '',
          seatNumber: '',
          mealPreference: 'NONE',
          specialAssistance: 'NONE'
        });
      }
      setPassengers(newPassengers);
    } else {
      setPassengers(passengers.slice(0, newNum));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleConfirmBooking = async () => {
    // Validate all passengers have required fields
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.dateOfBirth || !p.seatNumber) {
        alert(`Please fill all required fields for Passenger ${i + 1}`);
        return;
      }
    }

    // Check for duplicate seats
    const seatNumbers = passengers.map(p => p.seatNumber);
    const duplicates = seatNumbers.filter((seat, index) => seatNumbers.indexOf(seat) !== index);
    if (duplicates.length > 0) {
      alert(`Duplicate seats selected: ${duplicates.join(', ')}. Please select different seats.`);
      return;
    }

    const userId = getUserId();
    
    if (!userId) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const bookingData = {
        userId: userId,
        flightId: flight.id,
        totalPrice: flight.price * passengers.length,
        passengers: passengers
      };

      const response = await axios.post('http://localhost:8080/api/bookings', bookingData);
      
      alert(`Booking confirmed for ${passengers.length} passenger(s)! Reference: ${response.data.bookingReference}`);
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Booking failed. Please try again.');
      }
    }
  };

  // Generate seat options
  const seatOptions = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let row of rows) {
    for (let num = 1; num <= 10; num++) {
      seatOptions.push(`${row}${num}`);
    }
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!flight) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Flight not found</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
      <h2>Complete Your Booking</h2>
      
      {/* Flight Summary */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        marginBottom: '30px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>Flight Details</h3>
        <p><strong>Flight:</strong> {flight.airlineName} - {flight.flightNumber}</p>
        <p><strong>Route:</strong> {flight.origin} → {flight.destination}</p>
        <p><strong>Departure:</strong> {new Date(flight.departureDateTime).toLocaleString()}</p>
        <p><strong>Arrival:</strong> {new Date(flight.arrivalDateTime).toLocaleString()}</p>
        <p><strong>Duration:</strong> {flight.duration || 'N/A'}</p>
        <p><strong>Price per passenger:</strong> ${flight.price}</p>
      </div>

      {/* Number of Passengers */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '18px', fontWeight: 'bold' }}>Number of Passengers:</label>
        <select 
          value={numPassengers}
          onChange={(e) => handleNumPassengersChange(e.target.value)}
          style={{ 
            marginLeft: '15px',
            padding: '8px', 
            fontSize: '16px',
            borderRadius: '4px'
          }}
        >
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Passenger Forms */}
      {passengers.map((passenger, index) => (
        <div key={index} style={{ 
          border: '2px solid #007bff', 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3>Passenger {index + 1}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>First Name *</label>
              <input 
                type="text" 
                value={passenger.firstName}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div>
              <label>Last Name *</label>
              <input 
                type="text" 
                value={passenger.lastName}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div>
              <label>Date of Birth *</label>
              <input 
                type="date" 
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div>
              <label>Gender *</label>
              <select 
                value={passenger.gender}
                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label>Passport Number</label>
              <input 
                type="text" 
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div>
              <label>Nationality</label>
              <input 
                type="text" 
                value={passenger.nationality}
                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div>
              <label>Seat Number *</label>
              <select 
                value={passenger.seatNumber}
                onChange={(e) => handlePassengerChange(index, 'seatNumber', e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">-- Select Seat --</option>
                {seatOptions.map(seat => (
                  <option key={seat} value={seat}>{seat}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Meal Preference</label>
              <select 
                value={passenger.mealPreference}
                onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="NONE">No Preference</option>
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {/* Total Price */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3>Total Price: ${flight.price * passengers.length}</h3>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>
          ({passengers.length} passenger{passengers.length > 1 ? 's' : ''} × ${flight.price})
        </p>
      </div>

      {/* Buttons */}
      <button 
        onClick={handleConfirmBooking}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '18px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Confirm Booking
      </button>

      <button 
        onClick={() => navigate(-1)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Back
      </button>
    </div>
  );
}

export default BookingPage;