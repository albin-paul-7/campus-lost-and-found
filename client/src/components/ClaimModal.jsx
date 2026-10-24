import { useState } from 'react';

const ClaimModal = ({ item, isOpen, onClose, onSubmitClaim, loading }) => {
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setValidationError('Please explain identifying details to verify your claim.');
      return;
    }
    setValidationError('');
    onSubmitClaim({ message, contactInfo });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Claim This Item</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <p className="modal-subtitle">
          You are claiming: <strong>"{item?.title}"</strong>
        </p>

        {validationError && (
          <div className="form-error-banner">{validationError}</div>
        )}

        <form onSubmit={handleSubmit} className="claim-form">
          <div className="form-group">
            <label htmlFor="claim-message" className="form-label">
              Verification Proof / Identifying Details *
            </label>
            <textarea
              id="claim-message"
              rows="4"
              className="form-textarea"
              placeholder="Describe unique features, wallpaper, scratches, serial numbers, or items inside to prove ownership..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <small className="form-helper">
              The person who posted this item will review these details before handing it over.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="claim-contact" className="form-label">
              Your Phone Number or Contact Email (Optional)
            </label>
            <input
              type="text"
              id="claim-contact"
              className="form-input"
              placeholder="e.g. +91 9876543210 or your student email"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting Claim...' : 'Submit Claim Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;
