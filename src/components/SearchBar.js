export default function SearchBar({ onSearch }) {
    return (
      <input
        type="text"
        placeholder="Search items..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ marginBottom: '20px', width: '100%' }}
      />
    );
  }
  