import { useState } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import { 
  LogOut, 
  Package, 
  LayoutDashboard, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
} from 'lucide-react';
import WorkspaceList from './WorkspaceList';
import WorkspaceDetail from './WorkspaceDetail';
import SettingsPage from './SettingsPage';
import { APP_NAME } from '../config';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const greeting = `Good ${today.getHours() < 12 ? 'morning' : today.getHours() < 18 ? 'afternoon' : 'evening'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 flex relative">
      {/* Sleek, dark sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-xl z-20 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-5 border-b border-slate-800">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="ml-3 text-xl font-semibold text-white tracking-tight">{APP_NAME}</span>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-6 px-3">
          <p className={`text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 ${sidebarCollapsed ? 'text-center' : 'px-3'}`}>
            {!sidebarCollapsed && 'Main'}
          </p>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${
                !selectedWorkspace 
                  ? 'bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-400' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setSelectedWorkspace(null)}
            >
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Workspaces</span>}
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Settings</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute top-24 -right-3 z-30 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-600 shadow-md transition-all"
        style={{ left: sidebarCollapsed ? '5rem' : '18rem' }}
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean header - no redundant text, no notification bell */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Dynamic title */}
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {selectedWorkspace ? selectedWorkspace.name : 'Dashboard'}
                </h1>
                {!selectedWorkspace && (
                  <p className="text-sm text-slate-500 mt-0.5">
                    Manage your inventory across different locations
                  </p>
                )}
              </div>

              {/* Search - only show when not in a workspace */}
              {!selectedWorkspace && (
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>

            {/* Right side - Date and greeting only */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{formattedDate}</span>
              </div>
              <div className="h-5 w-px bg-slate-200"></div>
              <div className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">{greeting}, {user?.firstName || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Animated Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route 
              index 
              element={
                <div className="animate-fade-in-up">
                  {selectedWorkspace ? (
                    <WorkspaceDetail
                      workspace={selectedWorkspace}
                      onBack={() => setSelectedWorkspace(null)}
                    />
                  ) : (
                    <WorkspaceList 
                      onSelectWorkspace={setSelectedWorkspace} 
                      searchQuery={globalSearch}
                    />
                  )}
                </div>
              } 
            />
            <Route path="settings" element={<SettingsPage user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}