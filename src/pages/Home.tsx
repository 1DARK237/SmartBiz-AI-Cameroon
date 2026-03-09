import React, { useState, useEffect } from 'react';
import { Sparkles, PenTool, FileText, MessageSquare, X, Play, Video } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadedImage {
  id: string;
  url: string;
  title: string;
  date: string;
}

interface UploadedVideo {
  id: string;
  url: string;
  title: string;
  platform: string;
  date: string;
}

export default function Home() {
  const [portfolioImages, setPortfolioImages] = useState<UploadedImage[]>([]);
  const [socialVideos, setSocialVideos] = useState<UploadedVideo[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imgRes, vidRes] = await Promise.all([
          fetch('/api/images'),
          fetch('/api/videos')
        ]);
        if (imgRes.ok) setPortfolioImages(await imgRes.json());
        if (vidRes.ok) setSocialVideos(await vidRes.json());
      } catch (e) {
        console.error("Failed to fetch data from server", e);
      }
    };
    fetchData();
  }, []);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Empowering Cameroon's <br className="hidden md:block" />
            <span className="text-emerald-400">Small Businesses with AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-10"
          >
            Simple, affordable AI solutions to create marketing content, design logos, and generate business plans in minutes.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <a href="#contact" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/30 inline-block">
              Get Started
            </a>
            <a href="#services" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition-all inline-block">
              View Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
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

      {/* Social Media Videos Section (Dynamic from Admin) */}
      {socialVideos.length > 0 && (
        <section className="py-20 px-4 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Video className="w-8 h-8 text-blue-400" />
                Learn with Us on Social Media
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Watch our latest tutorials and tips on how to use AI for your business.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialVideos.map((vid, index) => (
                <motion.a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={vid.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden block shadow-xl"
                >
                  <div className="aspect-[9/16] w-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                    {/* Platform background gradient */}
                    <div className={`absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500 ${
                      vid.platform === 'TikTok' ? 'bg-gradient-to-br from-cyan-500 to-pink-500' :
                      vid.platform === 'Instagram' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' :
                      vid.platform === 'YouTube' ? 'bg-gradient-to-br from-red-600 to-red-900' :
                      'bg-gradient-to-br from-blue-500 to-blue-800'
                    }`} />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <h3 className="font-bold text-xl text-white mb-4 leading-tight drop-shadow-md">{vid.title}</h3>
                      <span className="inline-block px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-full text-sm text-white font-medium border border-white/10">
                        Watch on {vid.platform}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

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
              {portfolioImages.map((img, index) => (
                <motion.div 
                  key={img.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                        Click to expand
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">{img.title}</h3>
                    <p className="text-sm text-slate-500">{new Date(img.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-emerald-100 mb-10 text-lg">
            Get in touch with us today to see how our AI solutions can help you save time, attract more customers, and grow your brand in Cameroon.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:njison50@gmail.com" className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold transition-all shadow-lg inline-block">
              Email Us
            </a>
            <a href="https://wa.me/237675450486" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 px-8 py-3 rounded-full font-semibold transition-all shadow-lg inline-block">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-1">{selectedImage.title}</h3>
              <p className="text-slate-300">{new Date(selectedImage.date).toLocaleDateString()}</p>
            </div>
          </motion.div>
        </div>
      )}
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
