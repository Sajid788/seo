// server.js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server'; // For SSR routing
import App from './src/App'; // Your main App component
import fs from 'fs';
import path from 'path';

const app = express();
const PORT =  3000;

// Serve static files (build output)
app.use(express.static(path.resolve(__dirname, 'build')));

// HTML template with placeholders for meta tags and React root
const htmlTemplate = fs.readFileSync(path.resolve(__dirname, 'build/index.html'), 'utf8');

app.get('*', (req, res) => {
  // Dynamic data fetch example (replace with your API/DB logic)
  const urlPath = req.path;
  let pageData = { title: 'Default Title', description: 'Default Desc', image: '/default-og-image.jpg' };

  // Example: For dynamic route like /post/:id
  if (urlPath.startsWith('/post/')) {
    const postId = urlPath.split('/')[2];
    // Simulate async fetch (use fetch() or your data source)
    pageData = {
      title: `Dynamic Post Title for ID ${postId}`,
      description: `Dynamic description for post ${postId}.`,
      image: `https://yourdomain.com/og-image-${postId}.jpg`, // Dynamic image URL
    };
  }

  // Render React app with router context
  const ReactApp = renderToString(
    <StaticRouter location={req.url}>
      <App initialData={pageData} /> {/* Pass data to App for hydration */}
    </StaticRouter>
  );

  // Generate dynamic meta tags
  const metaTags = `
    <meta property="og:title" content="${pageData.title}">
    <meta property="og:description" content="${pageData.description}">
    <meta property="og:image" content="${pageData.image}">
    <meta property="og:url" content="https://yourdomain.com${req.url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageData.title}">
    <meta name="twitter:description" content="${pageData.description}">
    <meta name="twitter:image" content="${pageData.image}">
  `;

  // Inject into template
  const fullHtml = htmlTemplate
    .replace('<div id="root"></div>', `<div id="root">${ReactApp}</div>`)
    .replace('</head>', `${metaTags}</head>`)
    .replace('__INITIAL_DATA__', JSON.stringify(pageData)); // For client hydration

  res.send(fullHtml);
});

app.listen(PORT, () => {
  console.log(`SSR Server running on port ${PORT}`);
});
