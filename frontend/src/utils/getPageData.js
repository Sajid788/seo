// Frontend handles all logic - get data based on route
// Data structure matches backend for consistency

const pageData = {
  default: {
    title: 'React SSR SEO App',
    description: 'A React app with Server-Side Rendering for dynamic social media previews',
    image: 'https://via.placeholder.com/1200x630',
    type: 'website'
  },
  posts: {
    '1': {
      title: 'Amazing Post About React SSR',
      description: 'Learn how to implement Server-Side Rendering in React for better SEO and social media previews. This post covers everything you need to know.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      type: 'article'
    },
    '2': {
      title: 'Advanced React Patterns',
      description: 'Discover advanced patterns and techniques for building modern React applications. Learn from real-world examples.',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop',
      type: 'article'
    }
  },
  products: {
    '123': {
      title: 'Premium Wireless Headphones',
      description: 'Experience crystal-clear audio with our premium wireless headphones. Comfortable, stylish, and packed with features. Buy now!',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630&fit=crop',
      type: 'product'
    }
  }
};

export function getPageData(urlPath) {
  // Default/Home
  if (urlPath === '/' || !urlPath) {
    return pageData.default;
  }

  // Posts
  if (urlPath.startsWith('/post/')) {
    const postId = urlPath.split('/')[2];
    return pageData.posts[postId] || {
      title: `Post ${postId}`,
      description: `This is post number ${postId}. Read the full article to learn more.`,
      image: 'https://via.placeholder.com/1200x630',
      type: 'article'
    };
  }

  // Products
  if (urlPath.startsWith('/product/')) {
    const productId = urlPath.split('/')[2];
    return pageData.products[productId] || {
      title: `Product ${productId}`,
      description: `Check out our amazing product ${productId}. High quality and great value!`,
      image: 'https://via.placeholder.com/1200x630',
      type: 'product'
    };
  }

  return pageData.default;
}

