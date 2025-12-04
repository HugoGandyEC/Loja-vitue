import React from 'react';
import { ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { PRODUCTS, BRANDS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              O Futuro da Tecnologia<br/>
              <span className="text-blue-400">Está Aqui.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Descubra os melhores gadgets e eletrônicos com ofertas exclusivas. 
              Entrega rápida e segura para todo o Brasil.
            </p>
            <Link 
              to="/category/all"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-slate-900 bg-white hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Comprar Agora <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Frete Grátis</h3>
                <p className="text-sm text-gray-500">Para compras acima de R$ 500</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-green-50 text-green-600 rounded-full">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Garantia Estendida</h3>
                <p className="text-sm text-gray-500">30 dias para devolução grátis</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pagamento Seguro</h3>
                <p className="text-sm text-gray-500">Até 12x sem juros no cartão</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Navegue por Categorias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                idx === 0 ? 'from-blue-600 to-blue-800' : 
                idx === 1 ? 'from-indigo-600 to-purple-800' : 
                'from-teal-600 to-emerald-800'
              } opacity-90 transition-opacity group-hover:opacity-100`}></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                  <ul className="text-blue-100 text-sm space-y-1">
                    {cat.subcategories.slice(0, 3).map(sub => (
                      <li key={sub.id}>• {sub.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center text-white font-medium">
                  Ver produtos <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Destaques da Semana</h2>
            <Link to="/category/all" className="text-blue-600 font-medium hover:text-blue-700">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-8 text-center text-gray-400 uppercase tracking-widest">Nossas Marcas Parceiras</h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {BRANDS.map(brand => (
             <div key={brand.id} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xl">
                  {brand.name[0]}
                </div>
                <span className="mt-2 font-medium">{brand.name}</span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default Home;