import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const formattedDate = new Date(item.date || item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`item-card ${isLost ? 'card-lost' : 'card-found'}`}>
      <div className="item-card-header">
        <span className={`type-badge ${isLost ? 'type-lost' : 'type-found'}`}>
          {isLost ? 'LOST' : 'FOUND'}
        </span>
        <span className={`status-badge status-${item.status || 'active'}`}>
          {item.status === 'resolved' ? 'Resolved' : item.status === 'claimed' ? 'Claim In Progress' : 'Active'}
        </span>
      </div>

      <div className="item-card-body">
        <div className="item-category-tag">{item.category}</div>
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-desc">
          {item.description.length > 95
            ? `${item.description.substring(0, 95)}...`
            : item.description}
        </p>

        <div className="item-card-meta">
          <div className="meta-row">
            <svg
              className="meta-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="meta-text">{item.location}</span>
          </div>

          <div className="meta-row">
            <svg
              className="meta-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="meta-text">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="item-card-footer">
        <span className="reporter-author">
          By {item.postedBy?.name ? item.postedBy.name.split(' ')[0] : 'Campus Member'}
        </span>
        <Link to={`/items/${item._id}`} className="btn btn-sm btn-view">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
