import React, { useState } from 'react';
import { ClipboardList, ShoppingCart, FileText, CheckSquare, DollarSign } from 'lucide-react';

const AdminSales: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vendas');

  const tabs = [
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'os', label: 'Ordem de Serviço', icon: ClipboardList },
    { id: 'contrato', label: 'Contratos', icon: FileText },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestão Comercial</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <tab.icon className="mb-2 w-6 h-6" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-6">
         {activeTab === 'vendas' && (
           <div>
             <div className="flex justify-between mb-6">
               <h2 className="text-lg font-semibold">Histórico de Vendas</h2>
               <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">+ Nova Venda</button>
             </div>
             <div className="text-center text-gray-500 py-10">
               Nenhuma venda registrada hoje.
             </div>
           </div>
         )}
         
         {activeTab === 'os' && (
           <div>
              <div className="flex justify-between mb-6">
               <h2 className="text-lg font-semibold">Ordens de Serviço</h2>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">+ Nova OS</button>
             </div>
           </div>
         )}

         {/* Placeholders for others */}
         {['contrato', 'checklist', 'financeiro'].includes(activeTab) && (
           <div className="flex items-center justify-center h-64 text-gray-400">
             Conteúdo do módulo {activeTab}
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminSales;