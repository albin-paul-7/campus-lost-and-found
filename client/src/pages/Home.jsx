import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

const Home = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0, recoveryRate: 0 });
  
  // 4 States tracking (Section 7.3)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Items from API Client (Section 7.2)
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 9,
        search: search.trim() || undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined
      };

      const res = await itemService.getItems(params);
      if (res.success) {
        setItems(res.items || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the Campus Lost & Found API');
    } finally {
      setLoading(false);
    }
  }, [search, selectedType, selectedCategory, selectedStatus, page]);

  // Fetch campus stats
  const fetchStats = async () => {
    try {
      const res = await itemService.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch {
      // Non-blocking fallback
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250); // slight debounce for search input
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setPage(1);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Official Campus Portal</span>
          <h1 className="hero-title">
            Misplaced something? <br />
            Or spotted someone's belongings?
          </h1>
          <p className="hero-subtitle">
            The central lost and found network for students, faculty, and campus staff.
            Report items in seconds and reunite lost belongings with their owners.
          </p>
          <div className="hero-actions">
            <Link to="/report" className="btn btn-primary btn-lg">
              Report an Item
            </Link>
            <a href="#feed-section" className="btn btn-secondary btn-lg">
              Browse Active Feed
            </a>
          </div>

          {/* Real-time stats bar */}
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Reported</span>
            </div>
            <div className="stat-card">
              <span className="stat-number stat-lost">{stats.lost}</span>
              <span className="stat-label">Lost Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number stat-found">{stats.found}</span>
              <span className="stat-label">Found Items</span>
            </div>
            <div className="stat-card">
              <span className="stat-number stat-resolved">{stats.resolved}</span>
              <span className="stat-label">Reunited ({stats.recoveryRate}%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feed Section */}
      <section id="feed-section" className="feed-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Campus Bulletin Feed</h2>
            <p className="section-subtitle">
              {totalCount > 0 ? `Showing ${items.length} of ${totalCount} items` : 'Live campus updates'}
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <FilterBar
          search={search}
          setSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          selectedType={selectedType}
          setSelectedType={(val) => {
            setSelectedType(val);
            setPage(1);
          }}
          selectedCategory={selectedCategory}
          setSelectedCategory={(val) => {
            setSelectedCategory(val);
            setPage(1);
          }}
          selectedStatus={selectedStatus}
          setSelectedStatus={(val) => {
            setSelectedStatus(val);
            setPage(1);
          }}
          onReset={handleResetFilters}
        />

        {/* 4 States Handling (Section 7.3) */}
        {loading ? (
          <LoadingSpinner message="Fetching campus lost & found feed..." />
        ) : error ? (
          <ErrorAlert message={error} onRetry={fetchItems} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No items found"
            message={
              search || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? "No items match your active search and filter criteria. Try adjusting your query or resetting filters."
                : "No lost or found items have been posted yet. Be the first to report!"
            }
            actionLabel={
              search || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? "Clear All Filters"
                : "Report Item"
            }
            onActionClick={
              search || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? handleResetFilters
                : null
            }
            actionLink={
              search || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? null
                : "/report"
            }
          />
        ) : (
          <>
            <div className="items-grid">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
