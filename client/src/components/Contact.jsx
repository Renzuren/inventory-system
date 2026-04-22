import { Mail, Code, Globe, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact the Developer</h1>
      
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Email</p>
              <a href="mailto:amparoralphlawrence9@gmail.com" className="text-emerald-600 hover:underline">
                amparoralphlawrence9@gmail.com
              </a>
              <p className="text-sm text-gray-500 mt-1">I typically respond within 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Code className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <p className="font-medium text-gray-700">GitHub</p>
              <a href="https://github.com/Renzuren" className="text-emerald-600 hover:underline">
                Renzuren
              </a>
              <p className="text-sm text-gray-500 mt-1">Check out the source code and contribute.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Globe className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Portfolio</p>
              <a href="https://ralphlawrenceamparo.netlify.app/" className="text-emerald-600 hover:underline">
                ralphlawrenceamparo.netlify.app
              </a>
              <p className="text-sm text-gray-500 mt-1">See more of my work.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Location</p>
              <p className="text-gray-600">Manila, Philippines</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">About This Project</h3>
          <p className="text-gray-600">
            Stockify is a full‑stack inventory management system built with React, Vite, Tailwind CSS, 
            Node.js, and Firestore. It's designed to be simple, fast, and secure.
          </p>
          <p className="text-gray-600 mt-3">
            Have suggestions or found a bug? Feel free to reach out!
          </p>
        </div>
      </div>
    </div>
  );
}