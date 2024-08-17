import { useState } from 'react';
import PantryItemForm from '../components/PantryItemForm';
import PantryList from '../components/PantryList';
import SearchBar from '../components/SearchBar';

export default function Pantry() {
  const [pantryItems, setPantryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addPantryItem = (item) => {
    setPantryItems([...pantryItems, item]);
  };

  const filteredItems = pantryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Pantry</h1>
      <SearchBar onSearch={setSearchQuery} />
      <PantryItemForm onAddItem={addPantryItem} />
      <PantryList items={filteredItems} />
    </div>
  );
}
