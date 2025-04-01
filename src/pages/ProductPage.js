import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products', { params: { limit: 10 } })
      .then(({ data }) => setProducts(data))
      .catch(() => setError("Failed to fetch initial products."))
      .finally(() => setLoading(false));
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryName, filters) => {
    setLoading(true);
    try {
      const filtersString = filters.length ? `&filters=${encodeURIComponent(filters.join(','))}` : '';
      const { data } = await axios.get(`http://localhost:5000/api/products?category=${encodeURIComponent(categoryName)}${filtersString}`);
      setProducts(data);
    } catch (error) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (category) {
      const selectedFiltersArray = Object.keys(selectedFilters).filter((key) => selectedFilters[key]);
      fetchProductsByCategory(category, selectedFiltersArray);
    }
  }, [category, selectedFilters, fetchProductsByCategory]);

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const fetchProductDetails = async (productId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      setError("Failed to fetch product details.");
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`?category=${encodeURIComponent(categoryName)}`);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
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
                <Nav.Link key={cat} onClick={() => handleCategoryClick(cat)} className="text-dark px-3 py-2">
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
