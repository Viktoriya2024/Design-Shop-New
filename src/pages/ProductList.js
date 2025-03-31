import { useLocation } from 'react-router-dom';  // Use useLocation for query params
import axios from 'axios';
import { useState, useEffect } from 'react';

const ProductList = () => {
  const location = useLocation(); // To get query params like ?category=kitchen
  const category = new URLSearchParams(location.search).get('category'); // Extract category from query string
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        products = await Product.find({ category: category });
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products?category=${category}`);
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [category]); // Re-run the effect when the category changes

  if (!category) {
    return <div>Please select a category to view products.</div>;
  }

  return (
    <div>
      <h2>Products in {category}</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.image} alt={product.name} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
