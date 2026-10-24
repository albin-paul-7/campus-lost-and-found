import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

const CATEGORIES = [
  'Electronics',
  'Books & Notes',
  'ID Cards & Wallets',
  'Clothing & Bags',
  'Keys',
  'Bottles & Accessories',
  'Jewelry & Watches',
  'Other'
];

const ReportItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: 'lost',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    contactInfo: user?.phone || user?.email || '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Item title is required';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters long';
    }

    if (!formData.category) {
      errs.category = 'Please select a category';
    }

    if (!formData.location.trim()) {
      errs.location = 'Campus location is required (e.g. Science Block 1st floor)';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please write a brief description of the item';
    } else if (formData.description.trim().length < 5) {
      errs.description = 'Description must be at least 5 characters';
    }

    if (!formData.contactInfo.trim()) {
      errs.contactInfo = 'Contact information (phone or email) is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await itemService.createItem(formData);
      if (res.success && res.item) {
        navigate(`/items/${res.item._id}`);
      } else {
        navigate('/my-items');
      }
    } catch (err) {
      setServerError(err.message || 'Failed to submit report. Please check your network.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-heading">Report a Campus Item</h1>
          <p className="form-subheading">
            Fill in the details below to notify students and faculty across campus.
          </p>
        </div>

        {serverError && <ErrorAlert message={serverError} />}

        <form onSubmit={handleSubmit} className="campus-form" noValidate>
          {/* Item Type Toggle */}
          <div className="form-group">
            <label className="form-label">Report Type *</label>
            <div className="type-selection-cards">
              <label className={`type-choice-card ${formData.type === 'lost' ? 'selected-lost' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleChange}
                />
                <span className="type-choice-title">🚨 I Lost Something</span>
                <span className="type-choice-desc">Help me find an item I misplaced</span>
              </label>

              <label className={`type-choice-card ${formData.type === 'found' ? 'selected-found' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleChange}
                />
                <span className="type-choice-title">🎁 I Found Something</span>
                <span className="type-choice-desc">Help me return an item to its owner</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Item Title / Name *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Blue Dell Inspiron Laptop Charger, Casio Watch"
              value={formData.title}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          {/* Category & Location Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                className={`form-select ${errors.category ? 'input-error' : ''}`}
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Campus Location *
              </label>
              <input
                id="location"
                type="text"
                name="location"
                className={`form-input ${errors.location ? 'input-error' : ''}`}
                placeholder="e.g. Central Library 2nd Floor, Room 204"
                value={formData.location}
                onChange={handleChange}
                disabled={submitting}
                required
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>
          </div>

          {/* Date & Image URL Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date {formData.type === 'lost' ? 'Lost' : 'Found'}
              </label>
              <input
                id="date"
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">
                Photo URL (Optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="e.g. https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Mention brand, color, distinguishing marks, stickers, or condition..."
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          {/* Contact Information */}
          <div className="form-group">
            <label htmlFor="contactInfo" className="form-label">
              Contact Information for Inquiries / Handover *
            </label>
            <input
              id="contactInfo"
              type="text"
              name="contactInfo"
              className={`form-input ${errors.contactInfo ? 'input-error' : ''}`}
              placeholder="e.g. Mobile: +91 98765 43210 or Library Helpdesk"
              value={formData.contactInfo}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            {errors.contactInfo && <span className="field-error">{errors.contactInfo}</span>}
            <small className="form-helper">
              This information will be displayed on the item page so claimants or finders can reach you.
            </small>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Publishing Report...' : `Publish ${formData.type.toUpperCase()} Report`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;
