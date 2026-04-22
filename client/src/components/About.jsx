import { Package, Shield, Zap } from 'lucide-react';
import { APP_NAME } from '../config';

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About {APP_NAME}</h1>
      <p className="text-lg text-gray-600 max-w-3xl mb-12">
        {APP_NAME} is a modern inventory management solution built for small businesses and teams 
        who need simplicity without sacrificing power.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <Package className="w-10 h-10 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
          <p className="text-gray-600">
            Add, update, and delete items instantly with a clean interface.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <Shield className="w-10 h-10 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Cloud</h3>
          <p className="text-gray-600">
            Your data is encrypted and stored safely on Google Cloud Firestore.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <Zap className="w-10 h-10 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real‑time Sync</h3>
          <p className="text-gray-600">
            Changes appear instantly across all devices without refreshing.
          </p>
        </div>
      </div>
    </div>
  );
}