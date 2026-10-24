import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchMyItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemService.getMyItems();
      if (res.success) {
        setItems(res.items || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyItems();
  }, [fetchMyItems]);

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'resolved' ? 'active' : 'resolved';
    try {
      await itemService.updateStatus(item._id, nextStatus);
      setActionMessage(`Item marked as ${nextStatus}`);
      fetchMyItems();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await itemService.deleteItem(itemId);
      setActionMessage('Item deleted successfully');
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    if (activeTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Reported Items</h1>
            <p className="dashboard-subtitle">
              Manage items you have reported as lost or found across campus.
            </p>
          </div>
          <Link to="/report" className="btn btn-primary">
            + Report New Item
          </Link>
        </div>

        {actionMessage && (
          <div className="alert alert-success" role="status">
            {actionMessage}
          </div>
        )}

        {/* Tab Filters */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Items ({items.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'lost' ? 'active' : ''}`}
            onClick={() => setActiveTab('lost')}
          >
            Lost ({items.filter((i) => i.type === 'lost').length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            Found ({items.filter((i) => i.type === 'found').length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({items.filter((i) => i.status === 'resolved').length})
          </button>
        </div>

        {/* 4 States Handling */}
        {loading ? (
          <LoadingSpinner message="Loading your dashboard..." />
        ) : error ? (
          <ErrorAlert message={error} onRetry={fetchMyItems} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title={items.length === 0 ? "You haven't reported any items yet" : "No items in this category"}
            message={
              items.length === 0
                ? "Did you lose something in class or find a misplaced gadget? Report it now to track updates!"
                : "No items match your active tab filter."
            }
            actionLabel="Report an Item"
            actionLink="/report"
          />
        ) : (
          <div className="dashboard-list">
            {filteredItems.map((item) => (
              <div key={item._id} className="dashboard-item-card">
                <div className="dashboard-item-main">
                  <div className="dashboard-item-header">
                    <span className={`type-badge ${item.type === 'lost' ? 'type-lost' : 'type-found'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                    <span className="item-date">
                      {new Date(item.date || item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="dashboard-item-title">
                    <Link to={`/items/${item._id}`}>{item.title}</Link>
                  </h3>
                  <p className="dashboard-item-desc">{item.description}</p>
                  <div className="dashboard-item-meta">
                    <span>📍 {item.location}</span>
                    <span>🏷️ {item.category}</span>
                    {item.claims && item.claims.length > 0 && (
                      <span className="claims-tag">
                        💬 {item.claims.length} claim(s) received
                      </span>
                    )}
                  </div>
                </div>

                <div className="dashboard-item-actions">
                  <Link to={`/items/${item._id}`} className="btn btn-secondary btn-sm">
                    View
                  </Link>
                  <Link to={`/edit/${item._id}`} className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`btn btn-sm ${item.status === 'resolved' ? 'btn-secondary' : 'btn-success'}`}
                  >
                    {item.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
