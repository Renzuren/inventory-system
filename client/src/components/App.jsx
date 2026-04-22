import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'inventory'));
      const itemsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">📦 Inventory System</h1>
          <p className="text-gray-600 mt-2">Manage your products with ease</p>
        </header>

        <AddItemForm onItemAdded={fetchItems} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading inventory...</div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Current Inventory</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <InventoryTable items={items} onItemUpdated={fetchItems} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;