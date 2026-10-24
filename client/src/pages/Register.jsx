import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      phone: formData.phone.trim(),
      password: formData.password
    });

    setSubmitting(false);

    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setServerError(res.message || 'Failed to register account');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-card-header">
          <div className="brand-icon-box auth-icon-box">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 className="auth-title">Create Campus Account</h2>
          <p className="auth-subtitle">Join the university lost and found community</p>
        </div>

        {serverError && <ErrorAlert message={serverError} />}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">
              Full Name *
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {validationErrors.name && (
              <span className="field-error">{validationErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email Address *
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
              placeholder="e.g. rahul@campus.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="reg-dept" className="form-label">
                Department / Program
              </label>
              <input
                id="reg-dept"
                type="text"
                name="department"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone" className="form-label">
                Contact Phone Number
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                className="form-input"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                Password (min 6 chars) *
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={submitting}
                required
              />
              {validationErrors.password && (
                <span className="field-error">{validationErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm-password" className="form-label">
                Confirm Password *
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                name="confirmPassword"
                className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={submitting}
                required
              />
              {validationErrors.confirmPassword && (
                <span className="field-error">{validationErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
          >
            {submitting ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already have an account?</span>{' '}
          <Link to="/login" className="auth-link">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
