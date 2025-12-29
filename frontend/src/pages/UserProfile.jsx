import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { getUserId, isAuthenticated } from '../utils/auth';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to view your profile');
      navigate('/login');
      return;
    }
    
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = getUserId();
      
      if (!userId) {
        alert('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      const userResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
      setUser(userResponse.data);
      setFormData({
        firstName: userResponse.data.firstName,
        lastName: userResponse.data.lastName,
        phoneNumber: userResponse.data.phoneNumber || ''
      });
      
      const bookingsResponse = await axios.get(`http://localhost:8080/api/bookings/user/${userId}`);
      setBookingsCount(bookingsResponse.data.length);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || ''
    });
    setMessage('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = getUserId();
      
      const response = await axios.put(`http://localhost:8080/api/users/${userId}`, formData);
      
      setUser(response.data);
      setEditMode(false);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage('Please fill in all password fields');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      return;
    }
    
    setChangingPassword(true);
    setMessage('');
    
    try {
      const userId = getUserId();
      
      await axios.put('http://localhost:8080/api/auth/change-password', {
        userId: userId,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(error.response?.data?.error || 'Failed to change password. Please check your current password.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading profile...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h2 className="mb-4">My Profile</h2>
          
          {message && (
            <Alert 
              variant={message.includes('success') ? 'success' : 'danger'}
              dismissible 
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          )}
          
          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h3 className="text-primary mb-1">{bookingsCount}</h3>
                  <p className="text-muted mb-0">Total Bookings</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Badge bg={user.role === 'ADMIN' ? 'danger' : 'success'} className="fs-5 mb-2">
                    {user.role}
                  </Badge>
                  <p className="text-muted mb-0">Account Role</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-secondary mb-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </h6>
                  <p className="text-muted mb-0">Member Since</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Profile Details Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">👤 Account Information</h5>
            </Card.Header>
            <Card.Body className="p-4">
              
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">First Name</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          disabled={saving}
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          value={user.firstName}
                          readOnly
                          className="bg-light"
                        />
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Last Name</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          disabled={saving}
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          value={user.lastName}
                          readOnly
                          className="bg-light"
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={user.email}
                    readOnly
                    className="bg-secondary bg-opacity-10"
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed for security reasons
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Phone Number</Form.Label>
                  {editMode ? (
                    <Form.Control
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      disabled={saving}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      value={user.phoneNumber || 'Not provided'}
                      readOnly
                      className="bg-light"
                    />
                  )}
                </Form.Group>

                <div className="d-flex gap-2">
                  {!editMode ? (
                    <Button variant="primary" onClick={handleEdit} className="px-4">
                      ✏️ Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="success" 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4"
                      >
                        {saving ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              className="me-2"
                            />
                            Saving...
                          </>
                        ) : (
                          '💾 Save Changes'
                        )}
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Change Password Card */}
          {!editMode && (
            <Card className="shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">🔒 Change Password</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      disabled={changingPassword}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">New Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          disabled={changingPassword}
                        />
                        <Form.Text className="text-muted">
                          Minimum 6 characters
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          disabled={changingPassword}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Button 
                    variant="warning" 
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Changing Password...
                      </>
                    ) : (
                      '🔑 Change Password'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;