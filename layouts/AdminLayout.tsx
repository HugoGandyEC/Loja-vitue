import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LayoutDashboard, 
  UserCog,
  LogOut
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/clients', label: 'Cliente/Fornecedor', icon: Users },
    { path: '/admin/catalog', label: 'Cadastro', icon: Package },
    { path: '/admin/sales', label: 'Vendas', icon: ShoppingCart },
    { path: '/admin/team', label: 'Usuários/Colaboradores', icon: UserCog },
    { path: '/admin/config', label: 'Configuração', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">E</div>
           <span className="font-bold text-xl tracking-tight">EcoAdmin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors">
            <LogOut size={20} />
            <span>Sair para Loja</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;