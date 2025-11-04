function Home() {
  return (
    <div className="page">
      <h1>Welcome to React SSR SEO App</h1>
      <p>This is a React app with Server-Side Rendering for dynamic social media previews.</p>
      <p>Try sharing these links on WhatsApp, X (Twitter), or Facebook:</p>
      <ul>
        <li><a href="/post/1">Post 1</a></li>
        <li><a href="/post/2">Post 2</a></li>
        <li><a href="/product/123">Product 123</a></li>
      </ul>
      <p>Each link will show different title, description, and image in social media previews!</p>
    </div>
  )
}

export default Home

