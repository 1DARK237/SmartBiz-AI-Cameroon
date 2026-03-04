import React, { useState, useEffect } from 'react';
import { Sparkles, PenTool, FileText, MessageSquare } from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  title: string;
  date: string;
}

export default function Home() {
  const [portfolioImages, setPortfolioImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    const savedImages = localStorage.getItem('smartbiz_images');
    if (savedImages) {
      try {
        setPortfolioImages(JSON.parse(savedImages));
      } catch (e) {
        console.error("Failed to parse images from local storage", e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Empowering Cameroon's <br className="hidden md:block" />
            <span className="text-emerald-400">Small Businesses with AI</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Simple, affordable AI solutions to create marketing content, design logos, and generate business plans in minutes.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/30">
              Get Started
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition-all">
              View Services
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our AI Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We use cutting-edge AI tools to help your business grow without breaking the bank.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon={<PenTool className="w-8 h-8 text-emerald-500" />}
              title="Logo Design"
              description="Custom, professional logos generated with AI to give your brand a unique identity."
            />
            <ServiceCard 
              icon={<FileText className="w-8 h-8 text-blue-500" />}
              title="Business Plans"
              description="Comprehensive business plans structured perfectly using advanced language models."
            />
            <ServiceCard 
              icon={<Sparkles className="w-8 h-8 text-purple-500" />}
              title="Social Media Content"
              description="Engaging captions and eye-catching posters for your Instagram and Facebook."
            />
            <ServiceCard 
              icon={<MessageSquare className="w-8 h-8 text-orange-500" />}
              title="Customer Replies"
              description="Automated, professional responses to keep your customers happy and engaged."
            />
          </div>
        </div>
      </section>

      {/* Portfolio Section (Dynamic from Admin) */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Recent AI Creations</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Check out some of the amazing content we've generated for local businesses in Yaoundé.</p>
          </div>

          {portfolioImages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-500">No portfolio items yet. Visit the Admin dashboard to upload some examples!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioImages.map((img) => (
                <div key={img.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-md transition-all">
                  <div className="aspect-video w-full overflow-hidden bg-slate-100">
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">{img.title}</h3>
                    <p className="text-sm text-slate-500">{new Date(img.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
      <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
