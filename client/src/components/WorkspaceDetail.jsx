import { useState, useEffect, useCallback } from 'react';
import { Package, Download, Printer, ArrowLeft, Upload } from 'lucide-react';
import AddItemForm from './AddItemForm';
import InventoryTable from './InventoryTable';
import StatsCards from './StatsCards';
import TrendChart from './TrendChart';
import SearchFilterBar from './SearchFilterBar';
import BulkImportModal from './BulkImportModal';
import EditItemModal from './EditItemModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import CategoryChart from './CategoryChart';
import RecentActivity from './RecentActivity';
import API from '../api';

export default function WorkspaceDetail({ workspace, onBack }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalValue: 0, lowStockCount: 0, totalItems: 0, trend: [] });
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ hasMore: false, nextCursor: null });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await API.get('/inventory/stats', { params: { workspaceId: workspace.id } });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchInventory = useCallback(async (reset = true, cursor = null) => {
    if (reset) setLoading(true);
    else setIsLoadingMore(true);

    try {
      const params = new URLSearchParams({ workspaceId: workspace.id });
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', 20);
      if (cursor) params.append('startAfter', cursor);

      const response = await API.get(`/inventory?${params.toString()}`);
      const { items, pagination } = response.data;

      if (reset) {
        setInventoryItems(items);
      } else {
        setInventoryItems(prev => [...prev, ...items]);
      }
      setPagination(pagination);

      const allCats = new Set(['All']);
      items.forEach(item => item.category && allCats.add(item.category));
      setCategories(Array.from(allCats));
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [workspace.id, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchInventory(true);
    fetchStats();
  }, [fetchInventory]);

  const handleAddInventory = async (data) => {
    await API.post('/inventory', { ...data, workspaceId: workspace.id });
    fetchInventory(true);
    fetchStats();
  };

  const handleDeleteInventory = async () => {
    if (!deletingItem) return;
    try {
      await API.delete(`/inventory/${deletingItem.id}`, { params: { workspaceId: workspace.id } });
      setDeletingItem(null);
      fetchInventory(true);
      fetchStats();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 0) return;
    try {
      await API.patch(`/inventory/${id}`, { quantity: newQty, workspaceId: workspace.id });
      fetchInventory(true);
      fetchStats();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleExportCSV = () => {
    window.open(`${API.defaults.baseURL}/inventory/export?workspaceId=${workspace.id}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const loadMore = () => {
    if (pagination.hasMore && !isLoadingMore) {
      fetchInventory(false, pagination.nextCursor);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-600" />
              {workspace.name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage inventory items in this workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Bulk Import</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Quick Add Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <TrendChart data={stats.trend} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Categories</h3>
          <CategoryChart items={inventoryItems} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
          <RecentActivity workspaceId={workspace.id} />
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Add</h3>
        <AddItemForm
          compact
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'quantity', label: 'Qty', type: 'number', required: true },
            { name: 'price', label: 'Price', type: 'number', step: '0.01' },
            { name: 'category', label: 'Category', type: 'text', required: false },
          ]}
          onSubmit={handleAddInventory}
          categories={categories}
        />
      </div>

      {/* Search and Filter */}
      <SearchFilterBar
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Inventory Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-500 mt-3">Loading inventory...</p>
        </div>
      ) : (
        <>
          <InventoryTable
            items={inventoryItems}
            onDelete={(item) => setDeletingItem(item)}
            onUpdateQuantity={handleUpdateQuantity}
            onEdit={(item) => setEditingItem(item)}
            lowStockThreshold={5}
          />
          {pagination.hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <BulkImportModal
          workspaceId={workspace.id}
          onClose={() => setShowBulkImport(false)}
          onSuccess={() => {
            fetchInventory(true);
            fetchStats();
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          workspaceId={workspace.id}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            fetchInventory(true);
            fetchStats();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <DeleteConfirmModal
          itemName={deletingItem.name}
          onConfirm={handleDeleteInventory}
          onClose={() => setDeletingItem(null)}
        />
      )}
    </div>
  );
}