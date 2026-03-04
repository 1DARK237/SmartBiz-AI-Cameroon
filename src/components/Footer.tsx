import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-center mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        
        {/* --- LOGO IN FOOTER --- */}
        <div className="mb-6 flex items-center gap-3">
          {/* Change this logo the same way as the Navbar (upload to public folder) */}
          <img 
            src="/logo.jpg" 
            alt="SmartBiz AI Logo" 
            className="h-10 w-10 object-cover rounded-full shadow-sm border border-slate-700"
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/seed/smartbiz/100/100';
            }}
          />
          <span className="font-bold text-xl text-white">SmartBiz AI</span>
        </div>

        {/* --- SOCIAL MEDIA LINKS --- */}
        {/* HOW TO EDIT: Replace the '#' in the href="..." attribute with your actual profile URL */}
        <div className="flex space-x-6 mb-8">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors" aria-label="Facebook">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors" aria-label="Twitter">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6" />
          </a>
        </div>

        {/* --- COPYRIGHT TEXT --- */}
        {/* You can edit the text below to change your company name, year, or location */}
        <p className="mb-2">&copy; {new Date().getFullYear()} SmartBiz AI Cameroon. Empowering Small Businesses.</p>
        <p className="text-sm text-slate-500">Yaoundé, Cameroon</p>
      </div>
    </footer>
  );
}
