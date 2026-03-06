import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle, Video, Play, Lock } from 'lucide-react';

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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPlatform, setVideoPlatform] = useState('TikTok');

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [imgRes, vidRes] = await Promise.all([
        fetch('/api/images'),
        fetch('/api/videos')
      ]);
      if (imgRes.ok) setImages(await imgRes.json());
      if (vidRes.ok) setVideos(await vidRes.json());
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'NJI' && password === 'admin#123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please upload an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Url = e.target?.result as string;
      
      const newImage: UploadedImage = {
        id: Math.random().toString(36).substring(2, 9),
        url: base64Url,
        title: uploadTitle.trim() || file.name.split('.')[0],
        date: new Date().toISOString(),
      };

      try {
        const res = await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImage)
        });
        if (res.ok) {
          setImages(prev => [newImage, ...prev]);
          setUploadTitle('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setError('Failed to save image to server.');
        }
      } catch (err) {
        setError('Network error saving image.');
      }
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() || !videoTitle.trim()) {
      setError('Please provide both a title and a URL for the video.');
      return;
    }

    const newVideo: UploadedVideo = {
      id: Math.random().toString(36).substring(2, 9),
      url: videoUrl.trim(),
      title: videoTitle.trim(),
      platform: videoPlatform,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        setVideos(prev => [newVideo, ...prev]);
        setVideoTitle('');
        setVideoUrl('');
      } else {
        setError('Failed to save video to server.');
      }
    } catch (err) {
      setError('Network error saving video.');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      setVideos(prev => prev.filter(vid => vid.id !== id));
    } catch (err) {
      console.error("Failed to delete video", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your portfolio images and social media videos. Changes are synced instantly.</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-sm text-slate-500 hover:text-slate-900 font-medium"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Upload Image Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              Upload Image
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Image Title</label>
              <input 
                type="text" 
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., Bakery Logo Design"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInput} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          </div>
        </div>

        {/* Upload Video Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              Add Social Media Video
            </h2>
            
            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Video Title</label>
                <input 
                  type="text" 
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g., How to use ChatGPT"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                <select 
                  value={videoPlatform}
                  onChange={(e) => setVideoPlatform(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Video Link (URL)</label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add Video Link
              </button>
            </form>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="lg:col-span-3 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Gallery Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Uploaded Images</h2>
          <span className="bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1 rounded-full">
            {images.length} items
          </span>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="aspect-square w-full bg-slate-200">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDeleteImage(img.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Social Media Videos</h2>
          <span className="bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1 rounded-full">
            {videos.length} items
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500">No videos added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((vid) => (
              <div key={vid.id} className="group relative bg-slate-900 rounded-xl border border-slate-200 overflow-hidden">
                <div className="aspect-[9/16] w-full flex flex-col items-center justify-center p-4 text-center relative">
                  {/* Platform background gradient */}
                  <div className={`absolute inset-0 opacity-40 ${
                    vid.platform === 'TikTok' ? 'bg-gradient-to-br from-cyan-500 to-pink-500' :
                    vid.platform === 'Instagram' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' :
                    vid.platform === 'YouTube' ? 'bg-gradient-to-br from-red-600 to-red-900' :
                    'bg-gradient-to-br from-blue-500 to-blue-800'
                  }`} />
                  
                  <div className="relative z-10">
                    <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{vid.title}</h3>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white font-medium">
                      {vid.platform}
                    </span>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
