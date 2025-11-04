import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../config/api'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(getApiUrl(`/products/${id}`))
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return <div className="page">Loading...</div>
  }

  if (!product) {
    return <div className="page">Product not found</div>
  }

  return (
    <div className="page">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} style={{ maxWidth: '100%', height: 'auto' }} />
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <div>{product.content}</div>
    </div>
  )
}

export default Product

