import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import logo from '../assets/logo.png';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'retailer'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.role
      };

      await authService.submitUserDetail(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skewed-bg bgGreySignUp">
      <div className="container">
        <br /><br />
        <div className="form-wrapper">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form method="POST" onSubmit={handleSubmit}>
                <div className="signUpmainForm h-100">
                  <div className="headerForm">
                    <h1 style={{ fontWeight: 'bold', fontSize: '40px', fontFamily: 'inherit', fontStyle: 'normal', color: '#000' }}>
                      Welcome to <img src={logo} alt="PickNDeal" style={{ height: '45px', verticalAlign: 'middle' }} />
                    </h1>
                    <p>Enter your details below</p>
                  </div>
                  
                  <div className="selectProfile">
                    <div 
                      className={`userSelect ${formData.role === 'retailer' ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect('retailer')}
                    >
                      <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
                      </svg>
                      Retailer
                    </div>
                    <div 
                      className={`userSelect ${formData.role === 'supplier' ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect('supplier')}
                    >
                      <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>
                      </svg>
                      Supplier
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-6">
                      <div className="formGroup">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                          required
                          type="text"
                          pattern="[a-zA-Z0-9\s]+"
                          className="form-control"
                          value={formData.firstName}
                          onChange={handleChange}
                          name="firstName"
                          id="firstName"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-6">
                      <div className="formGroup">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                          required
                          type="text"
                          pattern="[a-zA-Z0-9\s]+"
                          className="form-control"
                          value={formData.lastName}
                          onChange={handleChange}
                          name="lastName"
                          id="lastName"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-6">
                      <div className="formGroup">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                          required
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          id="email"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-6">
                      <div className="formGroup">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                          required
                          type="tel"
                          pattern="[0-9]{8,15}"
                          placeholder="12345678910"
                          className="form-control"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          name="phone"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="formGroup">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group mb-3">
                          <input
                            required
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="formGroup">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="input-group mb-3">
                          <input
                            required
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mt-5 text-center">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                  </div>
                  <div className="mb-3 mt-5 text-center">
                    <div className="login-link">
                      Have an account?{' '}
                      <Link to="/login" className="is-link has-text-brand">
                        <strong>Sign In</strong>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;