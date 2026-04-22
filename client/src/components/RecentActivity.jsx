import { useEffect, useState } from 'react';
import { History, ArrowUp, ArrowDown } from 'lucide-react';
import API from '../api';

export default function RecentActivity({ workspaceId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await API.get(`/inventory/history/recent?workspaceId=${workspaceId}&limit=5`);
        setActivities(res.data);
      } catch (error) {
        console.error('Failed to fetch recent activity', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [workspaceId]);

  if (loading) return <div className="py-4 text-center text-gray-400">Loading activity...</div>;
  if (activities.length === 0) return <p className="py-4 text-gray-400 text-center">No recent activity</p>;

  return (
    <div className="space-y-3">
      {activities.map(act => (
        <div key={act.id} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">{act.itemName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Qty:</span>
            <span className={`font-medium ${act.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {act.change > 0 ? '+' : ''}{act.change}
            </span>
            {act.change > 0 ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
          </div>
        </div>
      ))}
    </div>
  );
}