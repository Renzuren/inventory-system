import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ items }) {
  const categoryCounts = {};
  items.forEach(item => {
    const cat = item.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const data = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      data: Object.values(categoryCounts),
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'],
      borderWidth: 0,
    }],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
    },
    maintainAspectRatio: false,
  };

  if (items.length === 0) {
    return <p className="text-gray-400 text-center py-8">No items to display</p>;
  }

  return (
    <div className="h-48">
      <Pie data={data} options={options} />
    </div>
  );
}