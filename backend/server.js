const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
// Enable CORS
app.use(cors());

// Dummy blog posts data
const posts = [
  {
    id: 1,
    title: "Amazing Post About React SSR",
    description: "Learn how to implement Server-Side Rendering in React for better SEO and social media previews. This post covers everything you need to know.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
    author: "John Doe",
    date: "2025-11-04",
    content: "This is the content of post 1...",
    type: "article"
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Discover advanced patterns and techniques for building modern React applications. Learn from real-world examples.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop",
    author: "Jane Smith",
    date: "2025-11-03",
    content: "This is the content of post 2...",
    type: "article"
  }
];

// Dummy products data
const products = [
  {
    id: 123,
    title: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our premium wireless headphones. Comfortable, stylish, and packed with features. Buy now!",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630&fit=crop",
    price: 199.99,
    content: "These headphones feature active noise cancellation, 30-hour battery life, and premium sound quality.",
    type: "product"
  }
];

// Route: Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Route: Get single post by ID
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// Route: Get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Route: Get single product by ID
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});


// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper function to get page data from route (same logic as frontend)
function getPageDataFromRoute(urlPath) {
  let data = {
    title: "React SSR SEO App",
    description: "A React app with Server-Side Rendering for dynamic social media previews",
    image: "https://via.placeholder.com/1200x630",
    type: "website"
  };

  // Check if it's a post
  if (urlPath.startsWith("/post/")) {
    const postId = parseInt(urlPath.split("/")[2]);
    const post = posts.find(p => p.id === postId);
    if (post) {
      data = {
        title: post.title,
        description: post.description,
        image: post.image,
        type: post.type
      };
    }
  }
  // Check if it's a product
  else if (urlPath.startsWith("/product/")) {
    const productId = parseInt(urlPath.split("/")[2]);
    const product = products.find(p => p.id === productId);
    if (product) {
      data = {
        title: product.title,
        description: product.description,
        image: product.image,
        type: product.type
      };
    }
  }

  return data;
}

// Serve static files from client build (after API routes)
app.use(express.static(path.resolve(__dirname, "public")));

// Serve HTML for SPA routes with dynamic meta tags (for social media sharing)
app.get("*", (req, res) => {
  try {
    const urlPath = req.url.split("?")[0]; // Remove query params
    const htmlPath = path.resolve(__dirname, "public/index.html");
    let html = fs.readFileSync(htmlPath, "utf8");
    
    // Get page data based on route (same data as endpoints)
    const pageData = getPageDataFromRoute(urlPath);
    const protocol = req.get("x-forwarded-proto") || req.protocol || "http";
    const baseUrl = `${protocol}://${req.get("host")}`;
    
    // Add random number to title
    const randomNum = Math.random();
    pageData.title = `${pageData.title} ${randomNum}`;
    
    // Debug: Log what title will be set
    console.log(`📄 Serving ${urlPath} with title: "${pageData.title}"`);

    // Generate dynamic meta tags for social media
    const metaTags = `
    <meta property="og:title" content="${escapeHtml(pageData.title)}">
    <meta property="og:description" content="${escapeHtml(pageData.description)}">
    <meta property="og:image" content="${pageData.image}">
    <meta property="og:url" content="${baseUrl}${urlPath}">
    <meta property="og:type" content="${pageData.type}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(pageData.title)}">
    <meta name="twitter:description" content="${escapeHtml(pageData.description)}">
    <meta name="twitter:image" content="${pageData.image}">
    <meta name="description" content="${escapeHtml(pageData.description)}">
    `;

    // Inject dynamic title
    html = html.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(pageData.title)}</title>`
    );
    
    // Also ensure title is in the right place if not found
    if (!html.includes(`<title>${escapeHtml(pageData.title)}</title>`)) {
      html = html.replace("</head>", `<title>${escapeHtml(pageData.title)}</title></head>`);
    }
    
    // Inject meta tags before closing head tag
    html = html.replace("</head>", `${metaTags}</head>`);
    
    // Inject initial data for client-side hydration
    html = html.replace(
      "<body>",
      `<body><script>window.__INITIAL_DATA__ = ${JSON.stringify(pageData)};</script>`
    );

    res.send(html);
  } catch (error) {
    console.error("Error serving HTML:", error);
    res.status(500).send("Error loading page");
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET /posts - List all posts`);
  console.log(`   GET /posts/:id - Get post by ID`);
  console.log(`   GET /products - List all products`);
  console.log(`   GET /products/:id - Get product by ID`);
});


