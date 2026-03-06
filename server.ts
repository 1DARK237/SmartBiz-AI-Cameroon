import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

const db = new Database('database.sqlite');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    url TEXT,
    title TEXT,
    date TEXT
  );
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    url TEXT,
    title TEXT,
    platform TEXT,
    date TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  // --- API ROUTES ---

  // Images
  app.get('/api/images', (req, res) => {
    try {
      const images = db.prepare('SELECT * FROM images ORDER BY date DESC').all();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });

  app.post('/api/images', (req, res) => {
    try {
      console.log('Received image upload request');
      const { id, url, title, date } = req.body;
      console.log(`Image details: id=${id}, title=${title}, url length=${url?.length}`);
      db.prepare('INSERT INTO images (id, url, title, date) VALUES (?, ?, ?, ?)').run(id, url, title, date);
      console.log('Image saved to database');
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image', details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.delete('/api/images/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM images WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete image' });
    }
  });

  // Videos
  app.get('/api/videos', (req, res) => {
    try {
      const videos = db.prepare('SELECT * FROM videos ORDER BY date DESC').all();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  });

  app.post('/api/videos', (req, res) => {
    try {
      const { id, url, title, platform, date } = req.body;
      db.prepare('INSERT INTO videos (id, url, title, platform, date) VALUES (?, ?, ?, ?, ?)').run(id, url, title, platform, date);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save video' });
    }
  });

  app.delete('/api/videos/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM videos WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete video' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
