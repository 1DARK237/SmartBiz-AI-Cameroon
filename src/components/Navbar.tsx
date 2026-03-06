import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- LOGO SECTION --- */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {/* 
                HOW TO CHANGE THE LOGO:
                1. Upload your logo image to the 'public' folder in your project files.
                2. Rename it to 'logo.jpg' OR change the src="/logo.jpg" below to match your file name.
              */}
              <img 
                src="/logo.jpg" 
                alt="SmartBiz AI Logo" 
                className="h-12 w-12 object-cover rounded-full shadow-sm border border-slate-100"
                onError={(e) => {
                  // This is a fallback just in case the logo.jpg is not found
                  e.currentTarget.src = 'https://picsum.photos/seed/smartbiz/100/100';
                }}
              />
              {/* You can edit the website name text below */}
              <span className="font-bold text-xl text-slate-900 hidden sm:block">SmartBiz AI</span>
            </Link>
          </div>

          {/* --- NAVIGATION LINKS --- */}
          <div className="flex items-center space-x-4">
            {/* To add a new page link, copy the line below and change the 'to' path and text */}
            <Link to="/" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Home</Link>
            
            <Link to="/admin" className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
