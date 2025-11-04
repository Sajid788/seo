import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Post from './pages/Post'
import Product from './pages/Product'
import { getApiUrl } from './config/api'
import './App.css'

function App({ initialData = {} }) {
  const location = useLocation()
  const [pageData, setPageData] = useState(initialData || {
    title: 'React SSR SEO App',
    description: 'A React app with Server-Side Rendering for dynamic social media previews',
    image: 'https://via.placeholder.com/1200x630',
    type: 'website'
  })
  const [loading, setLoading] = useState(false)

  // Fetch data from API endpoints when route changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let data = null

        // Fetch from appropriate endpoint based on route
        if (location.pathname.startsWith('/post/')) {
          const postId = location.pathname.split('/')[2]
          const response = await fetch(getApiUrl(`/posts/${postId}`))
          if (response.ok) {
            const post = await response.json()
            data = {
              title: post.title,
              description: post.description,
              image: post.image,
              type: post.type
            }
          }
        } else if (location.pathname.startsWith('/product/')) {
          const productId = location.pathname.split('/')[2]
          const response = await fetch(getApiUrl(`/products/${productId}`))
          if (response.ok) {
            const product = await response.json()
            data = {
              title: product.title,
              description: product.description,
              image: product.image,
              type: product.type
            }
          }
        } else {
          // For home page, use default data
          data = {
            title: 'React SSR SEO App',
            description: 'A React app with Server-Side Rendering for dynamic social media previews',
            image: 'https://via.placeholder.com/1200x630',
            type: 'website'
          }
        }

        if (data) {
          setPageData(data)
        }
      } catch (error) {
        console.error('Error fetching page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location.pathname])

  return (
    <>
      <Helmet>
        <title>{pageData.title || 'React SSR SEO App'}</title>
        <meta property="og:title" content={pageData.title || 'React SSR SEO App'} />
        <meta property="og:description" content={pageData.description || 'A React app with SSR for dynamic social media previews'} />
        <meta property="og:image" content={pageData.image || 'https://via.placeholder.com/1200x630'} />
        <meta property="og:url" content={`${window.location.origin}${location.pathname}`} />
        <meta property="og:type" content={pageData.type || 'website'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.title || 'React SSR SEO App'} />
        <meta name="twitter:description" content={pageData.description || 'A React app with SSR for dynamic social media previews'} />
        <meta name="twitter:image" content={pageData.image || 'https://via.placeholder.com/1200x630'} />
      </Helmet>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/post/1">Post 1</Link>
        <Link to="/post/2">Post 2</Link>
        <Link to="/product/123">Product 123</Link>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </main>
    </>
  )
}

export default App

