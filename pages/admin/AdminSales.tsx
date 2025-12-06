
import React, { useState, useRef } from 'react';
import { ClipboardList, ShoppingCart, FileText, Plus, Search, Edit, Trash2, CheckSquare, Calendar, PenTool, Upload, File, Printer, Download } from 'lucide-react';
import Modal from '../../components/Modal';
import { ServiceOrder, ChecklistTemplate, ContractTemplate } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';
import mammoth from 'mammoth';

// Mock Data for Checklists (Simulating data from Catalog module)
const AVAILABLE_CHECKLISTS: ChecklistTemplate[] = [
  { id: 'chk1', name: 'Padrão Instalação CFTV', description: 'Verificação pós-instalação', items: [], createdAt: '' },
  { id: 'chk2', name: 'Manutenção Preventiva PC', description: 'Limpeza e testes de hardware', items: [], createdAt: '' },
  { id: 'chk3', name: 'Diagnóstico Smartphone', description: 'Tela, bateria e conectividade', items: [], createdAt: '' },
];

const MOCK_OS_LIST: ServiceOrder[] = [
  {
    id: 'OS-2024-001',
    clientId: '1',
    clientName: 'João Silva',
    equipment: 'iPhone 13 Pro',
    issueDescription: 'Tela quebrada e bateria viciada',
    status: 'Em Análise',
    checklistTemplateId: 'chk3',
    checklistTemplateName: 'Diagnóstico Smartphone',
    dateIn: '2024-03-10',
  },
  {
    id: 'OS-2024-002',
    clientId: '2',
    clientName: 'Empresa Tech Ltda',
    equipment: 'Servidor Dell PowerEdge',
    issueDescription: 'Não liga após queda de energia',
    status: 'Aberto',
    checklistTemplateId: '',
    dateIn: '2024-03-12',
  }
];

const MOCK_CONTRACTS: ContractTemplate[] = [
  {
    id: 'cont1',
    title: 'Contrato de Prestação de Serviços - Padrão',
    lastModified: '2024-03-15',
    content: '<h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1><p><strong>CONTRATANTE:</strong> [Nome do Cliente], inscrito no CPF/CNPJ nº [XXX]...</p><p><strong>CONTRATADA:</strong> EcoSistens Tecnologia...</p><h2>1. DO OBJETO</h2><p>O presente contrato tem como objeto a prestação de serviços de manutenção de computadores.</p>'
  },
  {
    id: 'cont2',
    title: 'Termo de Garantia 90 Dias',
    lastModified: '2024-02-10',
    content: '<h1>TERMO DE GARANTIA</h1><p>A EcoSistens garante os serviços prestados pelo prazo de 90 dias...</p>'
  }
];

const AdminSales: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vendas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Service Order State
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(MOCK_OS_LIST);
  
  // Contract State
  const [contracts, setContracts] = useState<ContractTemplate[]>(MOCK_CONTRACTS);
  const [contractForm, setContractForm] = useState<ContractTemplate>({ id: '', title: '', content: '', lastModified: '' });
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialOsForm: Partial<ServiceOrder> = {
    clientName: '',
    equipment: '',
    serialNumber: '',
    issueDescription: '',
    checklistTemplateId: '',
    status: 'Aberto',
    dateIn: new Date().toISOString().split('T')[0]
  };
  
  const [osForm, setOsForm] = useState(initialOsForm);

  const tabs = [
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'os', label: 'Ordem de Serviço', icon: ClipboardList },
    { id: 'contrato', label: 'Contratos', icon: FileText },
  ];

  // --- SERVICE ORDER HANDLERS ---
  const handleOpenOsModal = (os?: ServiceOrder) => {
    if (os) {
      setOsForm(os);
    } else {
      setOsForm(initialOsForm);
    }
    setIsModalOpen(true);
  };

  const handleSaveOS = (e: React.FormEvent) => {
    e.preventDefault();
    const templateName = AVAILABLE_CHECKLISTS.find(c => c.id === osForm.checklistTemplateId)?.name;
    
    if (osForm.id) {
       setServiceOrders(prev => prev.map(o => o.id === osForm.id ? { ...o, ...osForm, checklistTemplateName: templateName } as ServiceOrder : o));
    } else {
       const newOs: ServiceOrder = {
         ...osForm as ServiceOrder,
         id: `OS-2024-${Math.floor(Math.random() * 1000)}`,
         checklistTemplateName: templateName
       };
       setServiceOrders(prev => [newOs, ...prev]);
    }
    setIsModalOpen(false);
  };

  // --- CONTRACT HANDLERS ---
  
  const handleOpenContractModal = (contract?: ContractTemplate) => {
    if (contract) {
      setContractForm(contract);
    } else {
      setContractForm({ id: '', title: 'Novo Contrato', content: '<p>Comece a digitar seu contrato aqui...</p>', lastModified: '' });
    }
    setIsContractModalOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContractForm({
          id: '', // New contract
          title: file.name.replace('.docx', ''),
          content: result.value,
          lastModified: new Date().toISOString().split('T')[0]
        });
        setIsContractModalOpen(true);
      } catch (error) {
        console.error("Erro ao converter arquivo:", error);
        alert("Erro ao ler o arquivo .docx. Certifique-se de que é um arquivo válido.");
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveContract = () => {
    const newContract = {
      ...contractForm,
      id: contractForm.id || `cont-${Date.now()}`,
      lastModified: new Date().toISOString().split('T')[0]
    };

    if (contractForm.id) {
      setContracts(prev => prev.map(c => c.id === contractForm.id ? newContract : c));
    } else {
      setContracts(prev => [newContract, ...prev]);
    }
    setIsContractModalOpen(false);
  };

  const handleDeleteContract = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este modelo?")) {
      setContracts(prev => prev.filter(c => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aberto': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Em Análise': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestão Comercial</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <tab.icon className="mb-2 w-6 h-6" />
            <span className="text-sm font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-indigo-200 min-h-[500px] overflow-hidden">
         {/* --- MODULE VENDAS --- */}
         {activeTab === 'vendas' && (
           <div className="p-6">
             <div className="flex justify-between mb-6">
               <h2 className="text-lg font-semibold text-gray-800">Histórico de Vendas</h2>
               <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 hover:shadow-lg">
                 <Plus size={16} /> Nova Venda
               </button>
             </div>
             <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
               <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
               <p>Nenhuma venda registrada hoje.</p>
             </div>
           </div>
         )}
         
         {/* --- MODULE ORDEM DE SERVIÇO --- */}
         {activeTab === 'os' && (
           <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-2.5 text-indigo-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Buscar OS por cliente, equipamento..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 border border-indigo-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
               </div>
               <button 
                 onClick={() => handleOpenOsModal()}
                 className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
               >
                 <ClipboardList size={18} /> Nova O.S.
               </button>
             </div>

             <div className="overflow-x-auto rounded-xl border border-indigo-200 shadow-xl bg-white">
                <table className="min-w-full divide-y divide-indigo-100">
                  <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Nº OS / Data</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Equipamento / Defeito</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Checklist Vinculado</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-indigo-50">
                    {serviceOrders.filter(os => 
                        os.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        os.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        os.id.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((os) => (
                      <tr key={os.id} className="transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:z-10 relative border-l-4 border-l-transparent hover:border-l-blue-500">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-indigo-900">{os.id}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12}/> {os.dateIn}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900 group-hover:text-blue-800">{os.clientName}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-sm text-gray-900 font-medium">{os.equipment}</div>
                           <div className="text-xs text-gray-500 truncate max-w-[200px]">{os.issueDescription}</div>
                        </td>
                        <td className="px-6 py-4">
                           {os.checklistTemplateName ? (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                               <CheckSquare size={12} className="mr-1" />
                               {os.checklistTemplateName}
                             </span>
                           ) : (
                             <span className="text-xs text-gray-400 italic">Nenhum</span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(os.status)}`}>
                             {os.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <button onClick={() => handleOpenOsModal(os)} className="text-indigo-600 hover:text-indigo-900 bg-white border border-indigo-200 p-2 rounded-lg mr-2 hover:bg-indigo-50 transition-colors shadow-sm"><Edit size={16}/></button>
                           <button className="text-red-500 hover:text-red-700 bg-white border border-red-200 p-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
         )}

         {/* --- MODULE CONTRATO --- */}
         {activeTab === 'contrato' && (
           <div className="p-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
               <h2 className="text-lg font-semibold text-gray-800">Modelos de Contrato</h2>
               <div className="flex gap-2 w-full md:w-auto">
                 {/* Hidden File Input */}
                 <input 
                   type="file" 
                   accept=".docx" 
                   ref={fileInputRef} 
                   className="hidden" 
                   onChange={handleFileUpload} 
                 />
                 
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                 >
                   <Upload size={18} /> Importar .docx
                 </button>
                 <button 
                   onClick={() => handleOpenContractModal()}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                 >
                   <Plus size={18} /> Criar Novo
                 </button>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contracts.map(contract => (
                  <div key={contract.id} className="bg-white rounded-xl border border-indigo-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col h-full hover:-translate-y-1">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                          <FileText size={24} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenContractModal(contract)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteContract(contract.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                     </div>
                     <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{contract.title}</h3>
                     <p className="text-xs text-gray-500 mb-4 mt-auto">Última edição: {contract.lastModified}</p>
                     
                     <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => handleOpenContractModal(contract)} className="flex-1 text-sm bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Editar</button>
                        <button className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                          <Printer size={14} /> Imprimir
                        </button>
                     </div>
                  </div>
                ))}
                
                {contracts.length === 0 && (
                  <div className="col-span-full text-center py-16 text-gray-500">
                    <File size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Nenhum contrato cadastrado.</p>
                    <p className="text-sm">Importe um arquivo Word ou crie um do zero.</p>
                  </div>
                )}
             </div>
           </div>
         )}
      </div>

      {/* MODAL DE O.S. */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={osForm.id ? `Editar O.S. ${osForm.id}` : "Nova Ordem de Serviço"}
        size="lg"
      >
        <form onSubmit={handleSaveOS} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
             <input 
               type="text" 
               required
               placeholder="Buscar cliente..."
               value={osForm.clientName} 
               onChange={e => setOsForm({...osForm, clientName: e.target.value})} 
               className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
             />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrada</label>
             <input 
               type="date" 
               required
               value={osForm.dateIn} 
               onChange={e => setOsForm({...osForm, dateIn: e.target.value})} 
               className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
             />
          </div>

          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Equipamento / Veículo</label>
             <input 
               type="text" 
               required
               value={osForm.equipment} 
               onChange={e => setOsForm({...osForm, equipment: e.target.value})} 
               className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
             />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Série / Placa</label>
             <input 
               type="text" 
               value={osForm.serialNumber} 
               onChange={e => setOsForm({...osForm, serialNumber: e.target.value})} 
               className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
             />
          </div>

          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Defeito / Serviço Solicitado</label>
             <textarea 
               rows={3}
               required
               value={osForm.issueDescription} 
               onChange={e => setOsForm({...osForm, issueDescription: e.target.value})} 
               className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
             />
          </div>

          <div className="md:col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
             <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
               <CheckSquare size={20} /> Vincular Checklist
             </h3>
             <label className="block text-sm text-indigo-700 mb-1">Selecione o modelo de verificação técnica:</label>
             <select 
               value={osForm.checklistTemplateId}
               onChange={e => setOsForm({...osForm, checklistTemplateId: e.target.value})}
               className="w-full bg-white text-gray-900 border border-indigo-200 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
             >
               <option value="">-- Nenhum checklist selecionado --</option>
               {AVAILABLE_CHECKLISTS.map(chk => (
                 <option key={chk.id} value={chk.id}>{chk.name} - {chk.description}</option>
               ))}
             </select>
             <p className="text-xs text-indigo-500 mt-2">
               O técnico utilizará este padrão para realizar a inspeção no equipamento.
             </p>
          </div>

          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Status Atual</label>
             <select 
               value={osForm.status}
               onChange={e => setOsForm({...osForm, status: e.target.value as any})}
               className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
             >
               <option value="Aberto">Aberto</option>
               <option value="Em Análise">Em Análise</option>
               <option value="Aguardando Peça">Aguardando Peça</option>
               <option value="Concluído">Concluído</option>
               <option value="Cancelado">Cancelado</option>
             </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">Salvar O.S.</button>
          </div>
        </form>
      </Modal>

      {/* MODAL DE CONTRATOS */}
      <Modal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        title="Editor de Contrato"
        size="2xl"
      >
         <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Modelo</label>
              <input 
                type="text" 
                value={contractForm.title} 
                onChange={e => setContractForm({...contractForm, title: e.target.value})} 
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-lg" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo do Contrato</label>
              <RichTextEditor 
                 content={contractForm.content} 
                 onChange={(html) => setContractForm({...contractForm, content: html})} 
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Dica: Você pode copiar e colar texto formatado do Word diretamente aqui também.
              </span>
              <div className="flex gap-3">
                 <button type="button" onClick={() => setIsContractModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
                 <button type="button" onClick={handleSaveContract} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">Salvar Modelo</button>
              </div>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default AdminSales;
