import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The page or campus item you were looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          ← Return to Campus Feed
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
