import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../config/api'

function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(getApiUrl(`/posts/${id}`))
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return <div className="page">Loading...</div>
  }

  if (!post) {
    return <div className="page">Post not found</div>
  }

  return (
    <div className="page">
      <h1>{post.title}</h1>
      <p><strong>Author:</strong> {post.author} | <strong>Date:</strong> {post.date}</p>
      <img src={post.image} alt={post.title} style={{ maxWidth: '100%', height: 'auto' }} />
      <p>{post.description}</p>
      <div>{post.content}</div>
    </div>
  )
}

export default Post

