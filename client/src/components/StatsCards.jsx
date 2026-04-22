import { Package, TrendingUp, AlertTriangle, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: <Package className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Value',
      value: `₱${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      trend: stats.lowStockCount > 0 ? 'Needs attention' : 'All good',
      trendUp: false,
      isAlert: stats.lowStockCount > 0,
    },
    {
      title: 'Stock Turnover',
      value: '4.2x',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      trend: '+0.8x',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
            <div className={`p-2.5 rounded-xl ${card.bg} group-hover:scale-110 transition-transform duration-200`}>
              <div className={`text-transparent bg-clip-text bg-gradient-to-r ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            {!card.isAlert && card.trendUp !== undefined && (
              <>
                {card.trendUp ? (
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`text-xs font-medium ${card.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {card.trend}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </>
            )}
            {card.isAlert && (
              <span className={`text-xs font-medium ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {card.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}