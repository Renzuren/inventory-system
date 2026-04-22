import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import API from '../api';

export default function BulkImportModal({ workspaceId, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new Error('CSV file is empty');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const nameIndex = headers.indexOf('name');
    const quantityIndex = headers.indexOf('quantity');
    const priceIndex = headers.indexOf('price');
    const categoryIndex = headers.indexOf('category');

    if (nameIndex === -1) throw new Error('CSV must contain a "name" column');

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === 0 || values.every(v => !v)) continue;
      
      const item = {
        name: values[nameIndex] || '',
        quantity: quantityIndex !== -1 ? values[quantityIndex] : '0',
        price: priceIndex !== -1 ? values[priceIndex] : '',
        category: categoryIndex !== -1 ? values[categoryIndex] : 'Uncategorized',
      };
      if (item.name) items.push(item);
    }
    return items;
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const text = await file.text();
      const items = parseCSV(text);
      
      if (items.length === 0) {
        throw new Error('No valid items found in CSV');
      }
      
      const response = await API.post('/inventory/bulk', {
        workspaceId,
        items,
      });
      
      setResults(response.data);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'name,quantity,price,category\nLaptop,10,45000,Electronics\nDesk Chair,5,3500,Furniture\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Bulk Import Items</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!results ? (
            <>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-800 mb-2 font-medium">CSV Format</p>
                <p className="text-xs text-emerald-700 mb-3">
                  Required column: <code className="bg-emerald-100 px-1 rounded">name</code><br />
                  Optional: <code>quantity</code>, <code>price</code>, <code>category</code>
                </p>
                <button
                  onClick={downloadTemplate}
                  className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  Download template CSV
                </button>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  {file ? file.name : 'Click to select CSV file'}
                </p>
                <p className="text-xs text-gray-400">or drag and drop</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {loading ? 'Uploading...' : 'Upload and Import'}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Import completed</span>
              </div>
              <p className="text-gray-600">
                Successfully added <strong>{results.added}</strong> items.
                {results.errors && results.errors.length > 0 && (
                  <span className="text-amber-600"> {results.errors.length} failed.</span>
                )}
              </p>
              {results.errors && results.errors.length > 0 && (
                <div className="max-h-40 overflow-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                  {results.errors.map((err, idx) => (
                    <div key={idx} className="text-xs text-red-600 py-1 border-b last:border-0">
                      {err.name || err.item?.name}: {err.error}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}