import { Link } from 'react-router-dom';
import { ArrowRight, Box, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../config';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-20 w-60 h-60 bg-teal-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Simple • Fast • Secure</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 max-w-4xl leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {APP_TAGLINE}
            </span>
            <br />
            without the complexity
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
            Track inventory in real time, stay organized, and focus on growing your business.
            No spreadsheets, no headaches.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/login"
              className="group bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              Start now — it's free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              Learn more
            </Link>
          </div>

          {/* Abstract Illustration */}
          <div className="max-w-3xl w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/50 to-teal-200/50 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Box, label: 'Add items' },
                    { icon: Layers, label: 'Track stock' },
                    { icon: ShieldCheck, label: 'Stay secure' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 p-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200/60 flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Real‑time updates • No page reloads
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Zero setup fees', desc: 'Start managing inventory immediately.' },
              { title: 'Unlimited items', desc: 'Add as many products as you need.' },
              { title: 'Cloud sync', desc: 'Access your data anywhere, anytime.' },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify your inventory?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join businesses that trust {APP_NAME} for effortless stock management.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Start now — it's free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}