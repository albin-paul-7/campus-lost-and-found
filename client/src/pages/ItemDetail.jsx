import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import ClaimModal from '../components/ClaimModal';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const fetchItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemService.getItemById(id);
      if (res.success && res.item) {
        setItem(res.item);
      } else {
        setError('Item details not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const isOwner =
    user && item && (user._id === item.postedBy?._id || user._id === item.postedBy);

  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      const res = await itemService.updateStatus(id, newStatus);
      if (res.success) {
        setActionSuccess(`Item successfully marked as ${newStatus}`);
        setItem((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this report?')) {
      return;
    }
    setActionLoading(true);
    try {
      await itemService.deleteItem(id);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to delete item');
      setActionLoading(false);
    }
  };

  const handleClaimSubmit = async ({ message, contactInfo }) => {
    setActionLoading(true);
    try {
      const res = await itemService.claimItem(id, { message, contactInfo });
      if (res.success) {
        setIsClaimModalOpen(false);
        setActionSuccess('Your claim request has been sent to the reporter!');
        fetchItem();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit claim request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading item details..." />;
  }

  if (error) {
    return (
      <div className="detail-container">
        <ErrorAlert message={error} onRetry={fetchItem} />
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/" className="btn btn-secondary">
            ← Return to Campus Feed
          </Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail-container">
        <EmptyState
          title="Item Not Found"
          message="The item you are looking for may have been removed or resolved."
          actionLabel="Browse Feed"
          actionLink="/"
        />
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const formattedDate = new Date(item.date || item.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Navigation back bar */}
        <div className="detail-top-nav">
          <Link to="/" className="btn btn-ghost btn-sm">
            ← Back to Feed
          </Link>
          <div className="detail-badges">
            <span className={`type-badge ${isLost ? 'type-lost' : 'type-found'}`}>
              {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
            </span>
            <span className={`status-badge status-${item.status}`}>
              Status: {item.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {actionSuccess && (
          <div className="alert alert-success" role="status">
            {actionSuccess}
          </div>
        )}

        <div className="detail-main-card">
          <div className="detail-header">
            <span className="detail-category">{item.category}</span>
            <h1 className="detail-title">{item.title}</h1>
            <div className="detail-meta-list">
              <div className="meta-item">
                <span className="meta-label">Campus Location:</span>
                <span className="meta-value">📍 {item.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date Reported:</span>
                <span className="meta-value">📅 {formattedDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Reported By:</span>
                <span className="meta-value">
                  👤 {item.postedBy?.name || 'Campus Member'} {item.postedBy?.department ? `(${item.postedBy.department})` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-body">
            <h3 className="section-subheading">Item Description</h3>
            <p className="detail-description">{item.description}</p>

            {item.imageUrl && (
              <div className="detail-image-box">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="detail-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Contact Box */}
            <div className="detail-contact-box">
              <h3 className="contact-heading">Contact & Handover Information</h3>
              <p className="contact-details">
                <strong>Reach Reporter At:</strong> {item.contactInfo}
              </p>
              {item.postedBy?.email && (
                <p className="contact-details">
                  <strong>Registered Email:</strong> {item.postedBy.email}
                </p>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="detail-actions-panel">
            {isOwner ? (
              <div className="owner-action-group">
                <span className="action-panel-label">Owner Controls:</span>
                <Link to={`/edit/${item._id}`} className="btn btn-secondary">
                  ✏️ Edit Report
                </Link>

                {item.status !== 'resolved' ? (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="btn btn-success"
                    disabled={actionLoading}
                  >
                    ✓ Mark as Resolved / Returned
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="btn btn-outline"
                    disabled={actionLoading}
                  >
                    Reopen as Active
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={actionLoading}
                >
                  🗑️ Delete Post
                </button>
              </div>
            ) : (
              <div className="visitor-action-group">
                {item.status === 'resolved' ? (
                  <div className="resolved-notice">
                    🎉 This item has already been marked as resolved and reunited!
                  </div>
                ) : isAuthenticated ? (
                  <button
                    onClick={() => setIsClaimModalOpen(true)}
                    className="btn btn-primary btn-lg"
                  >
                    🏷️ Claim This Item
                  </button>
                ) : (
                  <div className="auth-prompt-box">
                    <p>Have information or want to claim this item?</p>
                    <Link to="/login" className="btn btn-primary">
                      Log In to Claim
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Claims Received Section (Visible only to owner) */}
          {isOwner && item.claims && item.claims.length > 0 && (
            <div className="claims-section">
              <h3 className="section-subheading">
                Received Claim Requests ({item.claims.length})
              </h3>
              <div className="claims-list">
                {item.claims.map((claim, index) => (
                  <div key={index} className="claim-item-card">
                    <div className="claim-header">
                      <strong>{claim.claimantName}</strong>
                      <span className="claim-date">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="claim-message">{claim.message}</p>
                    <div className="claim-contact">
                      Contact: <strong>{claim.claimantContact}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal Dialog */}
      <ClaimModal
        item={item}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmitClaim={handleClaimSubmit}
        loading={actionLoading}
      />
    </div>
  );
};

export default ItemDetail;
