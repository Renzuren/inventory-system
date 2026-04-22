import { useState, useEffect } from 'react';
import { Plus, Package, Trash2, Loader, AlertCircle, ChevronRight, Box } from 'lucide-react';
import API from '../api';

export default function WorkspaceList({ onSelectWorkspace, searchQuery = '' }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [workspaceStats, setWorkspaceStats] = useState({});

  const fetchWorkspaces = async () => {
    try {
      const response = await API.get('/workspaces');
      const workspacesData = response.data;
      setWorkspaces(workspacesData);
      
      // Fetch stats for each workspace
      const statsPromises = workspacesData.map(async (ws) => {
        try {
          const statsRes = await API.get('/inventory/stats', { params: { workspaceId: ws.id } });
          return { id: ws.id, totalItems: statsRes.data.totalItems };
        } catch {
          return { id: ws.id, totalItems: 0 };
        }
      });
      const stats = await Promise.all(statsPromises);
      const statsMap = {};
      stats.forEach(s => { statsMap[s.id] = s.totalItems; });
      setWorkspaceStats(statsMap);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    setCreating(true);
    try {
      const response = await API.post('/workspaces', { name: newName });
      setWorkspaces([response.data, ...workspaces]);
      setWorkspaceStats(prev => ({ ...prev, [response.data.id]: 0 }));
      setNewName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this workspace and all its inventory?')) return;
    try {
      await API.delete(`/workspaces/${id}`);
      setWorkspaces(workspaces.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workspace:', error);
      alert(error.response?.data?.error || 'Failed to delete workspace');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Workspaces</h1>
        <p className="text-gray-500">Select a workspace or create a new one to manage inventory.</p>
      </div>

      <form onSubmit={handleCreate} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Workspace name (e.g., Warehouse 1)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-gray-700 placeholder:text-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {creating ? 'Creating...' : 'Create Workspace'}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>

      {filteredWorkspaces.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {searchQuery ? 'No matching workspaces' : 'No workspaces yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try a different search term.' : 'Create your first workspace above to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkspaces.map((ws) => (
            <div
              key={ws.id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => onSelectWorkspace(ws)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-200 transition-all">
                    <Package className="w-6 h-6 text-emerald-700" />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(ws.id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-lg"
                    title="Delete workspace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                  {ws.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Box className="w-4 h-4" />
                    <span>{workspaceStats[ws.id] || 0} items</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    {formatDate(ws.createdAt)}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Click to open</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}