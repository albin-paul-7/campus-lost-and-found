import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No items found',
  message = 'There are no items matching your criteria at this moment.',
  actionLabel = 'Report an Item',
  actionLink = '/report',
  onActionClick = null
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <svg
          className="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {onActionClick ? (
        <button onClick={onActionClick} className="btn btn-secondary">
          {actionLabel}
        </button>
      ) : actionLink ? (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
