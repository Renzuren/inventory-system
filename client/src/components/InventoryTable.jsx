import { Package, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function InventoryTable({ items, onDelete, onUpdateQuantity, onEdit, lowStockThreshold = 5 }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Inventory Items</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{items.length} items total</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Item Name</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Quantity</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Price</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Total Value</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">No items yet</h4>
                    <p className="text-gray-500 mb-4 max-w-md">
                      Get started by adding your first inventory item using the quick add form above.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isLowStock = item.quantity <= lowStockThreshold;
                const isOutOfStock = item.quantity === 0;
                const totalValue = item.price ? item.price * item.quantity : 0;
                
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 transition-all duration-150 ${
                      hoveredRow === item.id ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'
                    } ${isLowStock ? 'bg-amber-50/30' : ''}`}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
                          disabled={item.quantity <= 0}
                        >
                          −
                        </button>
                        <span className={`w-8 text-center font-semibold ${isLowStock ? 'text-amber-600' : 'text-gray-800'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {item.price ? `₱${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {item.price ? `₱${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-700">{items.length}</span> items
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-600">Page 1 of 1</span>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}