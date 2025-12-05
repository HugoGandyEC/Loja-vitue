import React, { useState } from 'react';
import { Save, Plus } from 'lucide-react';

type CatalogTab = 'produtos' | 'servicos' | 'marcas' | 'categorias' | 'subcategorias' | 'contrato';

const AdminCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CatalogTab>('produtos');

  const tabs: {id: CatalogTab, label: string}[] = [
    { id: 'produtos', label: 'Produtos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'marcas', label: 'Marcas' },
    { id: 'categorias', label: 'Categorias' },
    { id: 'subcategorias', label: 'Sub-Categorias' },
    { id: 'contrato', label: 'Contrato' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo e Cadastros</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save size={18} /> Salvar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* PRODUCT FORM */}
          {activeTab === 'produtos' && (
            <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Produto</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">NCM</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>

              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                   <option value="">Selecione...</option>
                   <option value="1">TechNova</option>
                 </select>
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                   <option value="">Selecione...</option>
                   <option value="1">Eletrônicos</option>
                 </select>
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Categoria</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                   <option value="">Selecione...</option>
                   <option value="1">Smartphones</option>
                 </select>
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                   <option value="un">UN</option>
                   <option value="kg">KG</option>
                   <option value="cx">CX</option>
                 </select>
              </div>

              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Selecione um fornecedor...</option>
                 </select>
              </div>

              <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Financeiro & Estoque</h3>
              </div>

              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Compra (R$)</label>
                 <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Margem (%)</label>
                 <input type="number" step="0.1" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Venda Varejo (R$)</label>
                 <input type="number" step="0.01" className="w-full border border-blue-300 rounded-md px-3 py-2 bg-blue-50 font-semibold text-blue-800" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Venda Atacado (R$)</label>
                 <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>

              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Estoque</label>
                 <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Exibir na Loja?</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                   <option value="yes">Sim</option>
                   <option value="no">Não</option>
                 </select>
              </div>

              <div className="md:col-span-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição para Loja Virtual (Detalhada)</label>
                 <textarea rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
              </div>
            </form>
          )}

          {/* SERVICE FORM */}
          {activeTab === 'servicos' && (
             <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="md:col-span-3">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">NCM</label>
                 <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2"><option>Selecione</option></select>
               </div>
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Categoria</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2"><option>Selecione</option></select>
               </div>
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2"><option>Hora</option><option>Serviço</option></select>
               </div>

                <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Financeiro</h3>
              </div>

              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
                 <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Margem (%)</label>
                 <input type="number" step="0.1" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Venda Varejo (R$)</label>
                 <input type="number" step="0.01" className="w-full border border-blue-300 rounded-md px-3 py-2 bg-blue-50 font-semibold text-blue-800" />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Venda Atacado (R$)</label>
                 <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Exibir na Loja?</label>
                 <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                   <option value="yes">Sim</option>
                   <option value="no">Não</option>
                 </select>
              </div>

               <div className="md:col-span-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Comercial</label>
                 <textarea rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
              </div>
             </form>
          )}

          {/* PLACEHOLDER FOR OTHER TABS */}
          {['marcas', 'categorias', 'subcategorias', 'contrato'].includes(activeTab) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
               <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900">Módulo em Desenvolvimento</h3>
               <p className="text-gray-500">A gestão de {activeTab} estará disponível em breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCatalog;