import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const category = CATEGORIES.find(c => c.slug === slug);
  const isAll = slug === 'all';

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Filter by Category
      const matchesCategory = isAll || product.categoryId === category?.id;
      
      // Filter by Search
      const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                          product.description.toLowerCase().includes(searchQuery);

      // Filter by Price
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [slug, category, searchQuery, priceRange, isAll]);

  const categoryName = isAll ? (searchQuery ? `Busca: "${searchParams.get('search')}"` : "Todos os Produtos") : category?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-500 mt-1">{filteredProducts.length} produtos encontrados</p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 md:hidden"
        >
          <SlidersHorizontal size={18} /> Filtros
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Filter size={20} /> Filtros
            </div>

            {/* Subcategories if specific category */}
            {!isAll && category && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Subcategorias</h3>
                <div className="space-y-2">
                  {category.subcategories.map(sub => (
                    <label key={sub.id} className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3" />
                      {sub.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Preço</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>R$ {priceRange[0]}</span>
                  <span>R$ {priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros ou buscar por outro termo.</p>
              <button 
                onClick={() => {
                   setPriceRange([0, 10000]);
                   // Optional: clear search query logic here if implemented via state
                }}
                className="mt-6 px-6 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;