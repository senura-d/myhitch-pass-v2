const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

// Copy all contents from 'public' to 'dist'
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, dist, { recursive: true });
}

// Copy all HTML files from 'views' to 'dist'
const viewsDir = path.join(__dirname, 'views');
if (fs.existsSync(viewsDir)) {
  const files = fs.readdirSync(viewsDir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      fs.copyFileSync(path.join(viewsDir, file), path.join(dist, file));
    }
  }
  
  // Special case: map '/' to 'login.html' as defined in server.js
  if (fs.existsSync(path.join(viewsDir, 'login.html'))) {
    fs.copyFileSync(path.join(viewsDir, 'login.html'), path.join(dist, 'index.html'));
  }
}

console.log('Build completed successfully! Static files are in the "dist" directory.');
