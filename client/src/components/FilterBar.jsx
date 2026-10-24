
const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Books & Notes',
  'ID Cards & Wallets',
  'Clothing & Bags',
  'Keys',
  'Bottles & Accessories',
  'Jewelry & Watches',
  'Other'
];

const FilterBar = ({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onReset
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-search-box">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, description, or campus building..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          aria-label="Search items"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="search-clear-btn"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-controls-row">
        {/* Type Filter Buttons */}
        <div className="type-toggle-group" role="group" aria-label="Filter by item type">
          <button
            type="button"
            className={`type-toggle-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All Items
          </button>
          <button
            type="button"
            className={`type-toggle-btn btn-lost-toggle ${selectedType === 'lost' ? 'active' : ''}`}
            onClick={() => setSelectedType('lost')}
          >
            Lost
          </button>
          <button
            type="button"
            className={`type-toggle-btn btn-found-toggle ${selectedType === 'found' ? 'active' : ''}`}
            onClick={() => setSelectedType('found')}
          >
            Found
          </button>
        </div>

        {/* Category Selector */}
        <div className="select-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat === 'All Categories' ? 'all' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="select-wrapper">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="claimed">Claimed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          type="button"
          onClick={onReset}
          className="btn btn-ghost btn-sm btn-reset-filters"
          title="Reset all filters"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
