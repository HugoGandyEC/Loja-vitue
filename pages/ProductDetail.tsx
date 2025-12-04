import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, BRANDS, CATEGORIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Star, Truck, Shield, RotateCcw, Plus, Minus, MessageSquare, Sparkles, Send } from 'lucide-react';
import { getProductAdvice, hasApiKey } from '../services/geminiService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = PRODUCTS.find(p => p.id === id);
  const brand = BRANDS.find(b => b.id === product?.brandId);
  const category = CATEGORIES.find(c => c.id === product?.categoryId);

  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  // AI State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (!product) {
    return <div className="p-10 text-center">Produto não encontrado</div>;
  }

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) {
        addToCart(product);
    }
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    setAiAnswer(null);
    const answer = await getProductAdvice(product, aiQuestion);
    setAiAnswer(answer);
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-8">
        <ol className="flex items-center gap-2">
          <li><button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button></li>
          <li>/</li>
          <li><button onClick={() => navigate(`/category/${category?.slug}`)} className="hover:text-blue-600">{category?.name}</button></li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover object-center" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  mainImage === img ? 'border-blue-600 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {brand && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {brand.name}
              </span>
            )}
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="fill-current w-4 h-4" />
              <span className="text-gray-900 font-medium text-sm">{product.rating}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">R$ {product.oldPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium">10x de R$ {(product.price / 10).toFixed(2)} sem juros</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-gray-200 rounded-xl bg-white w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 hover:bg-gray-50 rounded-l-xl text-gray-600"
              >
                <Minus size={20} />
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-4 hover:bg-gray-50 rounded-r-xl text-gray-600"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
            >
              Adicionar ao Carrinho
            </button>
          </div>

          {/* Features List */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Destaques</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-600 bg-white border border-gray-100 p-2 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">Frete Grátis</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">2 Anos Garantia</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">Devolução Fácil</p>
            </div>
          </div>

          {/* AI Consultant Section */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <button 
              onClick={() => setShowAiChat(!showAiChat)}
              className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-md">
                   <Sparkles size={20} />
                 </div>
                 <div className="text-left">
                   <h3 className="font-bold text-gray-900">Especialista Nexus IA</h3>
                   <p className="text-sm text-gray-500">Tem dúvidas? Pergunte à nossa IA sobre este produto.</p>
                 </div>
              </div>
              <MessageSquare className={`text-indigo-400 transition-transform ${showAiChat ? 'rotate-180' : ''}`} />
            </button>

            {showAiChat && (
              <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                {!hasApiKey() && (
                  <div className="bg-red-50 text-red-600 text-xs p-2 rounded mb-3">
                    Aviso: API Key do Gemini não detectada.
                  </div>
                )}
                
                {aiAnswer && (
                   <div className="bg-indigo-50 rounded-lg p-3 mb-4 text-gray-800 text-sm border-l-4 border-indigo-500">
                     <strong className="block text-indigo-700 mb-1">Nexus IA:</strong>
                     {aiAnswer}
                   </div>
                )}

                <form onSubmit={handleAskAi} className="relative">
                  <input 
                    type="text" 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ex: Esse celular é bom para fotos noturnas?"
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    disabled={aiLoading}
                  />
                  <button 
                    type="submit"
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {aiLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={16} />}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;