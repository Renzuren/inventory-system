import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function ErrorMessage({ message, onDismiss }) {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in slide-in-from-top-2 duration-200">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={handleDismiss}
        className="text-red-400 hover:text-red-600 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}