import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
  { value: 'name_desc', label: 'Name: Z–A' },
];

const MATERIALS = ['Wood', 'Metal', 'Fabric', 'Leather', 'Glass', 'Rattan'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const material = searchParams.get('material') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, search, sort, minPrice, maxPrice, material, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (material) params.set('material', material);
      params.set('page', page.toString());
      params.set('limit', '12');

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category || minPrice || maxPrice || material || search;

  const activeCategory = categories.find((c) => c.id.toString() === category);

  return (
    <div className="shop-page">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <div>
            <h1>{activeCategory ? activeCategory.name : search ? `Results for "${search}"` : 'All Furniture'}</h1>
            <p className="shop-count">{pagination.total} product{pagination.total !== 1 ? 's' : ''}</p>
          </div>
          <div className="shop-header-actions">
            <button className="btn btn-outline btn-sm shop-filter-toggle" onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter /> Filters
            </button>
            <div className="shop-sort">
              <FiChevronDown className="sort-icon" />
              <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)} className="shop-sort-select">
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className={`shop-sidebar ${filterOpen ? 'open' : ''}`}>
            <div className="shop-sidebar-header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
              )}
              <button className="shop-sidebar-close" onClick={() => setFilterOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Category</h4>
              <ul className="filter-list">
                <li>
                  <button className={`filter-item ${!category ? 'active' : ''}`} onClick={() => updateFilter('category', '')}>
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`filter-item ${category === cat.id.toString() ? 'active' : ''}`}
                      onClick={() => updateFilter('category', cat.id.toString())}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="filter-price-row">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="form-input filter-price-input"
                />
                <span className="filter-price-separator">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="form-input filter-price-input"
                />
              </div>
            </div>

            {/* Material */}
            <div className="filter-section">
              <h4 className="filter-title">Material</h4>
              <ul className="filter-list">
                <li>
                  <button className={`filter-item ${!material ? 'active' : ''}`} onClick={() => updateFilter('material', '')}>
                    All Materials
                  </button>
                </li>
                {MATERIALS.map((mat) => (
                  <li key={mat}>
                    <button
                      className={`filter-item ${material === mat ? 'active' : ''}`}
                      onClick={() => updateFilter('material', mat)}
                    >
                      {mat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="shop-content">
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="shop-empty">
                <p>No products found matching your criteria.</p>
                <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-3 shop-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="shop-pagination">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`pagination-btn ${p === pagination.page ? 'active' : ''}`}
                        onClick={() => updateFilter('page', p.toString())}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
