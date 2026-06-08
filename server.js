const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const pages = {
  '/':              'login',
  '/login':         'login',
  '/register':      'register',
  '/home':          'home',
  '/event-details': 'event-details',
  '/explore':       'explore',
  '/broadway':      'broadway',
  '/upcoming':      'upcoming',
  '/tickets':       'tickets',
  '/organizer':     'organizer',
  '/profile':       'profile',
  '/privacy':       'privacy',
  '/terms':         'terms',
  '/pricing':       'pricing',
  '/servicers':     'servicers',
  '/about-us':      'about',
  '/contact-us':    'contact',
};

Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (_req, res) => {
    res.sendFile(path.join(__dirname, 'views', `${file}.html`));
  });
});

app.listen(PORT, () => {
  console.log(`\n🎫  MYHitch Pass is running!\n    → http://localhost:${PORT}\n`);
});
