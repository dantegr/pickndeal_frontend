import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: '"OpenSans", sans-serif', fontSize: '14px', minHeight: '100vh', color: '#4b4b4b', background: '#fff' }}>
      {/* sign up Page */}
      <div className="skewed-bg bgGreySignUp">
        <div className="container">
          <br /><br />
          <div className="form-wrapper loginPage" style={{ minHeight: '500px', position: 'relative', zIndex: 9, overflow: 'hidden' }}>
            <form onSubmit={handleSubmit}>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="signUpmainForm h-100">
                    <div 
                      className="headerForm"
                      style={{ 
                        textAlign: 'center', 
                        paddingBottom: '35px' 
                      }}
                    >
                      <img src="/logo.png" alt="PickNDeal" />
                      <br /><br />
                      <h1 
                        className="text-start" 
                        style={{ 
                          fontFamily: '"OpenSans", sans-serif',
                          fontStyle: 'normal',
                          color: '#4b4b4b',
                          fontSize: '2em'
                        }}
                      >
                        Sign In
                      </h1>
                      <p 
                        className="text-start"
                        style={{
                          color: '#909097',
                          fontWeight: '500',
                          fontSize: '16px',
                          paddingTop: '10px'
                        }}
                      >
                        To access marketplace of suppliers and retailers!
                      </p>
                    </div>
                    
                    {/* main form */}
                    <div className="row">
                      <div className="col-md-12">
                        <div 
                          className="formGroup"
                          style={{ marginBottom: '2.0rem', position: 'relative' }}
                        >
                          <label 
                            htmlFor="userName" 
                            className="form-label"
                            style={{ fontWeight: '600' }}
                          >
                            Username
                          </label>
                          <input 
                            type="text" 
                            className="form-control"
                            id="userName" 
                            name="email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                              border: '0',
                              borderRadius: '0',
                              boxShadow: 'none',
                              borderBottom: '1px solid #b5b5b5',
                              letterSpacing: '0',
                              padding: '10px 10px 10px 0px',
                              appearance: 'auto',
                              backgroundColor: 'transparent'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div 
                          className="formGroup"
                          style={{ marginBottom: '2.0rem', position: 'relative' }}
                        >
                          <label 
                            htmlFor="password" 
                            className="form-label"
                            style={{ fontWeight: '600' }}
                          >
                            Password
                          </label>
                          <input 
                            type="password" 
                            className="form-control"
                            id="password" 
                            name="password" 
                            required
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                              border: '0',
                              borderRadius: '0',
                              boxShadow: 'none',
                              borderBottom: '1px solid #b5b5b5',
                              letterSpacing: '0',
                              padding: '10px 10px 10px 0px',
                              appearance: 'auto',
                              backgroundColor: 'transparent'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                
                    <div className="mb-3 mt-5 text-center">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                          background: '#2e42e2',
                          color: '#fff',
                          padding: '7px 40px'
                        }}
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </button>
                    </div>

                    <div className="d-flex justify-content-center links">
                      Don't have an account?&nbsp;&nbsp;
                      <Link 
                        to="/signup"
                        style={{ color: '#2e42e2', textDecoration: 'none' }}
                      >
                        Sign Up
                      </Link>
                    </div>
                    <div className="d-flex justify-content-center">
                      <Link 
                        to="/forgot-password"
                        style={{ color: '#2e42e2', textDecoration: 'none' }}
                      >
                        Forgot your password?
                      </Link>
                    </div>

                    {/* /main form */}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /sign up page */}
    </div>
  );
};

export default Login;