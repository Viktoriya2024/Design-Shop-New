import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import "../style/ProductPage.css";
import backImage from "../assets/image/home-bg.jpeg";

const categoryFilters = {
  "Mirrors": ["Wall Mirrors", "Full Length", "Round Mirrors", "Window Mirrors", "Floor Mirror", "Bathroom Vanity Mirrors"],
  "Plants and Flowers": ["Artificial Plants", "Topiary", "Ferns", "Palms", "Orchids"],
  "Decorative Accessories": ["Statues & Sculptures", "Vases", "Accent Pieces", "Outdoor Decor"],
  "Window Treatments": ["Curtains & Drapes", "Blinds & Shades", "Curtain Rods & Hardware", "Kitchen Curtains", "Window Valances", "Light Stained Glass Panels"],
  "Art": ["Gallery Wrapped Canvas", "Framed Prints", "Wood Wall Art", "Abstract Art", "Framed Canvas", "Floral Art"],
  "Throw Pillows": ["Accent Throw Pillows", "Throw Pillow Covers", "Outdoor Throw Pillows", "Floor Pillows", "Poufs"]
};

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const category = new URLSearchParams(location.search).get('category');

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    if (id) fetchProduct(id);
    else if (category) fetchProductsByCategory(category);
    else fetchAllProducts();
  }, [id, category]);

  const fetchProduct = async (productId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      setError("Failed to fetch product details.");
    }
  };

  const fetchProductsByCategory = async (categoryName) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products?category=${encodeURIComponent(categoryName)}`);
      setProducts(data);
    } catch (error) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch (error) {
      setError("Failed to fetch all products.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev, [filter]: !prev[filter] };
      return updatedFilters;
    });
  };

  return (
    <div className="background-container" style={{ backgroundImage: `url(${backImage})` }}>
      <h3 className="page-title">Select category</h3>
      <Navbar expand="md" className="mb-3">
        <div className="container-fluid">
          <Navbar.Toggle aria-controls="category-navbar" />
          <Navbar.Collapse id="category-navbar">
            <Nav className="d-flex flex-nowrap">
              {Object.keys(categoryFilters).map((cat) => (
                <Nav.Link key={cat} as={Link} to={`/products?category=${cat}`} className="text-dark px-3 py-2">
                  {cat}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}

      {category && categoryFilters[category] && (
        <div className="filters-sidebar">
          <h4>Filter by:</h4>
          <ul>
            {categoryFilters[category].map((filter) => (
              <li key={filter}>
                <input
                  type="checkbox"
                  id={`filter-${filter}`}
                  checked={!!selectedFilters[filter]}
                  onChange={() => handleFilterChange(filter)}
                />
                <label htmlFor={`filter-${filter}`}>{filter}</label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {id && product && (
        <div className="product-detail">
          <h2>{product.name}</h2>
          {product.image?.[0] && <img src={product.image[0]} alt={product.name} width="200" />}
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="product-container">
          <h2>{category ? `Products in ${category} category` : "All Products"}</h2>
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {product.image?.[0] && <img src={product.image[0]} alt={product.name} />}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <button className="add-product-btn">Add Product</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

