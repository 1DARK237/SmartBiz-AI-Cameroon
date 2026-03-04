import { Link } from 'react-router-dom';
import { Store, Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">SmartBiz AI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Home</Link>
            <Link to="/admin" className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
