import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminClients from './pages/admin/AdminClients';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminSales from './pages/admin/AdminSales';
import AdminTeam from './pages/admin/AdminTeam';

const ShopLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">E</div>
              <span className="font-bold text-xl">EcoSistens</span>
            </div>
            <p className="text-sm">Tecnologia de ponta ao seu alcance. A melhor experiência de compra online.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-blue-400">Contato</a></li>
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-blue-400">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-blue-400">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Seu e-mail" className="bg-slate-800 border-none rounded px-3 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500" />
              <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">OK</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2024 EcoSistens. Todos os direitos reservados.</p>
          <Link to="/admin" className="flex items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors mt-4 md:mt-0">
            <Lock size={12} />
            <span>Área Administrativa</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="/admin/dashboard" replace />} />
             <Route path="dashboard" element={<div className="p-8"><h1>Bem vindo ao Painel EcoSistens</h1><p className="text-gray-500">Selecione um módulo no menu lateral.</p></div>} />
             <Route path="clients" element={<AdminClients />} />
             <Route path="catalog" element={<AdminCatalog />} />
             <Route path="sales" element={<AdminSales />} />
             <Route path="team" element={<AdminTeam />} />
             <Route path="config" element={<div className="p-8"><h1>Configurações do Sistema</h1></div>} />
          </Route>

          {/* Shop Routes */}
          <Route path="/" element={<ShopLayout><Home /></ShopLayout>} />
          <Route path="/category/:slug" element={<ShopLayout><CategoryPage /></ShopLayout>} />
          <Route path="/product/:id" element={<ShopLayout><ProductDetail /></ShopLayout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
};

export default App;