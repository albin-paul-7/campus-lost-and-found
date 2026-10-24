import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
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

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: 'lost',
    category: 'Electronics',
    location: '',
    date: '',
    description: '',
    contactInfo: '',
    imageUrl: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const res = await itemService.getItemById(id);
        if (res.success && res.item) {
          const item = res.item;
          // Check ownership
          const ownerId = item.postedBy?._id || item.postedBy;
          if (user && ownerId && user._id !== ownerId && user.role !== 'admin') {
            setError('You do not have permission to edit this report.');
            setLoading(false);
            return;
          }

          setFormData({
            title: item.title,
            type: item.type,
            category: item.category,
            location: item.location,
            date: item.date ? item.date.split('T')[0] : '',
            description: item.description,
            contactInfo: item.contactInfo,
            imageUrl: item.imageUrl || '',
            status: item.status || 'active'
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch item data for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.contactInfo.trim()) errs.contactInfo = 'Contact information is required';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await itemService.updateItem(id, formData);
      if (res.success) {
        navigate(`/items/${id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading report for editing..." />;
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-heading">Edit Item Report</h1>
          <p className="form-subheading">Update details or change status for this post.</p>
        </div>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="campus-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="claimed">Claim In Progress</option>
                <option value="resolved">Resolved / Returned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input
              type="text"
              name="title"
              className={`form-input ${validationErrors.title ? 'input-error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              required
            />
            {validationErrors.title && (
              <span className="field-error">{validationErrors.title}</span>
            )}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Location *</label>
              <input
                type="text"
                name="location"
                className={`form-input ${validationErrors.location ? 'input-error' : ''}`}
                value={formData.location}
                onChange={handleChange}
                required
              />
              {validationErrors.location && (
                <span className="field-error">{validationErrors.location}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              rows="4"
              className={`form-textarea ${validationErrors.description ? 'input-error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              required
            />
            {validationErrors.description && (
              <span className="field-error">{validationErrors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Information *</label>
            <input
              type="text"
              name="contactInfo"
              className={`form-input ${validationErrors.contactInfo ? 'input-error' : ''}`}
              value={formData.contactInfo}
              onChange={handleChange}
              required
            />
            {validationErrors.contactInfo && (
              <span className="field-error">{validationErrors.contactInfo}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Photo URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

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
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
