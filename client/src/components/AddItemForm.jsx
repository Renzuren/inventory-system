import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function AddItemForm({ title, fields, onSubmit, compact = false, categories = [] }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({});
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const baseInputClasses = `w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl 
    focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
    transition-all duration-200 outline-none text-gray-700 placeholder:text-gray-400`;

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? '' : 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 backdrop-blur-sm'}
    >
      {!compact && (
        <h2 className="text-xl font-semibold mb-5 text-gray-800">{title}</h2>
      )}
      
      <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-5 gap-3'}`}>
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <select
                key={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={baseInputClasses}
                required={field.required}
              >
                <option value="">{field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            );
          }
          
          // Category field with datalist (text input with suggestions)
          if (field.name === 'category') {
            const datalistId = 'category-suggestions';
            return (
              <div key={field.name} className="relative">
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  list={datalistId}
                  className={baseInputClasses}
                  required={field.required}
                  autoComplete="off"
                />
                <datalist id={datalistId}>
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            );
          }
          
          return (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.label}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className={baseInputClasses}
              required={field.required}
              step={field.step}
              min={field.type === 'number' ? 0 : undefined}
            />
          );
        })}
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium 
            rounded-xl hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed 
            transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
            ${compact ? 'px-4 py-2.5' : 'px-5 py-2.5'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding...
            </span>
          ) : (compact ? 'Add' : 'Add Item')}
        </button>
      </div>
      
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </form>
  );
}