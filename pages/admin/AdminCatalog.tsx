
import React, { useState } from 'react';
import { Save, Plus, Search, Trash2, Edit, Image as ImageIcon, CheckSquare, Camera, FileText, Paperclip, GripVertical, Copy, Power, Eye } from 'lucide-react';
import { CATEGORIES, BRANDS, PRODUCTS } from '../../data/mockData';
import { Category, Brand, Product, ChecklistTemplate, ChecklistItem } from '../../types';
import Modal from '../../components/Modal';

type CatalogTab = 'produtos' | 'servicos' | 'marcas' | 'categorias' | 'subcategorias' | 'contrato' | 'checklist' | 'financeiro';

// Extend Product type locally for the UI state to handle "Active/Inactive" simulation
interface UiProduct extends Product {
  isActive?: boolean;
}

const AdminCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CatalogTab>('produtos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for Lists
  // Initialize products with an isActive flag for demonstration
  const [products, setProducts] = useState<UiProduct[]>(PRODUCTS.map(p => ({ ...p, isActive: true })));
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(BRANDS);
  
  // Mock Services for list
  const [services, setServices] = useState([
    { id: 's1', description: 'Formatação de PC', price: 150.00, category: 'Informática' },
    { id: 's2', description: 'Instalação de Câmera', price: 250.00, category: 'Segurança' },
  ]);

  // Mock Checklists
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>([
    {
      id: 'chk1',
      name: 'Padrão Instalação CFTV',
      description: 'Verificação completa pós-instalação de câmeras.',
      relatedServiceId: 's2',
      createdAt: new Date().toISOString(),
      items: [
        { id: '1', label: 'Verificar fixação da câmera', type: 'checkbox', required: true },
        { id: '2', label: 'Foto do ângulo de visão', type: 'photo', required: true },
        { id: '3', label: 'Teste de gravação noturna', type: 'text', required: false },
      ]
    }
  ]);

  // Form States
  const [productForm, setProductForm] = useState({
    id: '', barcode: '', name: '', description: '', ncm: '', brandId: '', categoryId: '', subCategoryId: '', 
    unit: 'un', model: '', serialNumber: '', purchasePrice: 0, margin: 0, retailPrice: 0, wholesalePrice: 0, stock: 0, showInStore: 'yes',
    images: [] as string[]
  });

  const [brandForm, setBrandForm] = useState({ name: '', logo: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [subCategoryForm, setSubCategoryForm] = useState({ parentId: '', name: '' });
  
  // Checklist Form State
  const [checklistForm, setChecklistForm] = useState<ChecklistTemplate>({
    id: '',
    name: '',
    description: '',
    relatedServiceId: '',
    items: [],
    createdAt: ''
  });

  const tabs: {id: CatalogTab, label: string}[] = [
    { id: 'produtos', label: 'Produtos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'marcas', label: 'Marcas' },
    { id: 'categorias', label: 'Categorias' },
    { id: 'subcategorias', label: 'Sub-Categorias' },
    { id: 'contrato', label: 'Contrato' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'financeiro', label: 'Financeiro' },
  ];

  // Helper to get subcategories for product form
  const availableSubCategories = categories.find(c => c.id === productForm.categoryId)?.subcategories || [];

  const handleOpenModal = (item?: any) => {
    // Reset forms based on active tab or fill if item exists
    if (activeTab === 'produtos') {
      if (item) {
         setProductForm({ 
           ...productForm, 
           ...item, 
           // Ensure these fields exist if mapping from partial types
           barcode: item.barcode || '', 
           ncm: item.ncm || '',
           unit: item.unit || 'un',
           model: item.model || '',
           serialNumber: item.serialNumber || '',
           purchasePrice: item.purchasePrice || 0,
           margin: item.margin || 0,
           retailPrice: item.price || 0, // Map from main price
           wholesalePrice: item.wholesalePrice || 0,
           showInStore: item.isActive ? 'yes' : 'no',
           stock: item.stock || 0,
           images: item.images || []
         });
      } else {
         // Reset
         setProductForm({
           id: '', barcode: '', name: '', description: '', ncm: '', brandId: '', categoryId: '', subCategoryId: '', 
           unit: 'un', model: '', serialNumber: '', purchasePrice: 0, margin: 0, retailPrice: 0, wholesalePrice: 0, stock: 0, showInStore: 'yes',
           images: []
         });
      }
    }
    
    if (activeTab === 'marcas' && item) {
       setBrandForm(item);
    }
    if (activeTab === 'checklist') {
      if (item) {
        setChecklistForm(item);
      } else {
        setChecklistForm({
          id: '',
          name: '',
          description: '',
          relatedServiceId: '',
          items: [],
          createdAt: ''
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleCloneProduct = (product: UiProduct) => {
    const clonedProduct = {
      ...productForm, // Base defaults
      ...product,
      id: '', // Reset ID for new creation
      name: `${product.name} (Cópia)`,
      retailPrice: product.price,
      images: product.images || []
    };
    setProductForm(clonedProduct as any);
    setIsModalOpen(true);
  };

  const handleToggleProductStatus = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  // --- Image Handling ---
  const handleAddImage = () => {
    // Generate random seed for mock
    const seed = Math.floor(Math.random() * 10000);
    const mockUrl = `https://picsum.photos/seed/${seed}/800/800`;
    
    // In a real app, this would be a file upload. Here we ask for URL or use mock.
    const url = window.prompt("Insira a URL da imagem (ou OK para gerar aleatória):", mockUrl);
    
    if (url !== null) {
        const finalUrl = url.trim() || mockUrl;
        setProductForm(prev => ({
            ...prev,
            images: [...(prev.images || []), finalUrl]
        }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductForm(prev => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const getModalTitle = () => {
    switch(activeTab) {
      case 'produtos': return 'Cadastro de Produto';
      case 'servicos': return 'Cadastro de Serviço';
      case 'marcas': return 'Cadastro de Marca';
      case 'categorias': return 'Cadastro de Categoria';
      case 'subcategorias': return 'Cadastro de Sub-Categoria';
      case 'checklist': return 'Criar Modelo de Checklist';
      default: return 'Cadastro';
    }
  };

  // Checklist Helpers
  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      label: '',
      type: 'checkbox',
      required: false
    };
    setChecklistForm(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateChecklistItem = (index: number, field: keyof ChecklistItem, value: any) => {
    const newItems = [...checklistForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setChecklistForm(prev => ({ ...prev, items: newItems }));
  };

  const removeChecklistItem = (index: number) => {
    const newItems = checklistForm.items.filter((_, i) => i !== index);
    setChecklistForm(prev => ({ ...prev, items: newItems }));
  };

  const saveChecklist = () => {
    if (!checklistForm.name) return;
    const newChecklist = { ...checklistForm, id: checklistForm.id || Date.now().toString(), createdAt: new Date().toISOString() };
    
    if (checklistForm.id) {
       setChecklists(prev => prev.map(c => c.id === checklistForm.id ? newChecklist : c));
    } else {
       setChecklists(prev => [...prev, newChecklist]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo e Cadastros</h1>
        <button 
           onClick={() => handleOpenModal()}
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Novo {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 custom-scrollbar">
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
          
          {/* PRODUCT LIST */}
          {activeTab === 'produtos' && (
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Venda</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map(p => (
                      <tr key={p.id} className={`transition-opacity ${p.isActive ? 'opacity-100' : 'opacity-50 bg-gray-50'}`}>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="relative">
                               <img src={p.images[0]} alt="" className={`w-12 h-12 rounded-lg object-cover border border-gray-200 ${!p.isActive && 'grayscale'}`} />
                               {!p.isActive && (
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                                   <Power size={16} className="text-gray-600" />
                                 </div>
                               )}
                             </div>
                             <div>
                               <div className="text-sm font-medium text-gray-900">{p.name}</div>
                               <div className="text-xs text-gray-500 flex items-center gap-2">
                                 COD: {p.id}
                                 {!p.isActive && <span className="text-red-500 font-bold text-[10px] border border-red-200 bg-red-50 px-1 rounded">INATIVO</span>}
                               </div>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                           {categories.find(c => c.id === p.categoryId)?.name || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">R$ {p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.stock} un
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             {/* Botão Clonar */}
                             <button 
                               onClick={() => handleCloneProduct(p)} 
                               title="Clonar Produto"
                               className="group flex items-center justify-center w-8 h-8 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                             >
                               <Copy size={16} />
                             </button>

                             {/* Botão Alterar */}
                             <button 
                               onClick={() => handleOpenModal(p)} 
                               title="Alterar Cadastro"
                               className="group flex items-center justify-center w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                             >
                               <Edit size={16} />
                             </button>

                             {/* Botão Desativar/Ativar */}
                             <button 
                               onClick={() => handleToggleProductStatus(p.id)}
                               title={p.isActive ? "Desativar Produto" : "Ativar Produto"}
                               className={`group flex items-center justify-center w-8 h-8 rounded-lg border transition-all shadow-sm ${
                                 p.isActive 
                                   ? 'border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200' 
                                   : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                               }`}
                             >
                               <Power size={16} />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {/* SERVICES LIST */}
          {activeTab === 'servicos' && (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Base</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map(s => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{s.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">R$ {s.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleOpenModal(s)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit size={16} /></button>
                           <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

           {/* BRANDS LIST */}
           {activeTab === 'marcas' && (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brands.map(b => (
                      <tr key={b.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-3">
                           <img src={b.logo} className="w-8 h-8 rounded object-cover border" alt="" />
                           {b.name}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleOpenModal(b)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit size={16} /></button>
                           <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {/* CATEGORIES LIST */}
          {activeTab === 'categorias' && (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategorias</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.subcategories.length}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleOpenModal(c)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit size={16} /></button>
                           <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {/* SUB-CATEGORIES LIST */}
          {activeTab === 'subcategorias' && (
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria Pai</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.flatMap(c => c.subcategories.map(s => ({...s, parentName: c.name}))).map(sub => (
                      <tr key={sub.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{sub.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{sub.parentName}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleOpenModal(sub)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit size={16} /></button>
                           <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

           {/* CHECKLIST LIST */}
          {activeTab === 'checklist' && (
            <div className="overflow-x-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {checklists.map(chk => (
                   <div key={chk.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-3">
                       <h3 className="font-bold text-gray-800">{chk.name}</h3>
                       <div className="flex gap-2">
                         <button onClick={() => handleOpenModal(chk)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16} /></button>
                         <button className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                       </div>
                     </div>
                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">{chk.description}</p>
                     
                     <div className="space-y-2 mb-4">
                       <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          <CheckSquare className="w-3 h-3 mr-2" />
                          {chk.items.length} itens de verificação
                       </div>
                       {chk.relatedServiceId && (
                         <div className="flex items-center text-xs text-blue-600 bg-blue-50 p-2 rounded">
                           <Paperclip className="w-3 h-3 mr-2" />
                           Vinculado a: {services.find(s => s.id === chk.relatedServiceId)?.description}
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
                 
                 <button 
                  onClick={() => handleOpenModal()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors min-h-[200px]"
                 >
                   <Plus size={32} className="mb-2" />
                   <span className="font-medium">Criar Novo Checklist</span>
                 </button>
               </div>
            </div>
          )}

          {/* OTHER TABS */}
          {['contrato', 'financeiro'].includes(activeTab) && (
            <div className="text-center py-12 text-gray-500">Módulo em desenvolvimento. Clique em Novo para testar o modal.</div>
          )}

        </div>
      </div>

      {/* GLOBAL MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={getModalTitle()}
        size={activeTab === 'produtos' || activeTab === 'servicos' || activeTab === 'checklist' ? '2xl' : 'md'}
      >
        
        {/* === PRODUCT FORM IN MODAL === */}
        {activeTab === 'produtos' && (
            <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.barcode} onChange={e => setProductForm({...productForm, barcode: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Produto</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">NCM</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.ncm} onChange={e => setProductForm({...productForm, ncm: e.target.value})} />
              </div>

              {/* INTEGRATED BRAND SELECT */}
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                 <select 
                   value={productForm.brandId}
                   onChange={(e) => setProductForm({...productForm, brandId: e.target.value})}
                   className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                   <option value="">Selecione...</option>
                   {brands.map(brand => (
                     <option key={brand.id} value={brand.id}>{brand.name}</option>
                   ))}
                 </select>
              </div>

              {/* INTEGRATED CATEGORY AND SUBCATEGORY */}
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                 <select 
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value, subCategoryId: '' })}
                    className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                   <option value="">Selecione...</option>
                   {categories.map(cat => (
                     <option key={cat.id} value={cat.id}>{cat.name}</option>
                   ))}
                 </select>
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Categoria</label>
                 <select 
                    value={productForm.subCategoryId}
                    onChange={(e) => setProductForm({ ...productForm, subCategoryId: e.target.value })}
                    disabled={!productForm.categoryId}
                    className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-200 disabled:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  >
                   <option value="">{productForm.categoryId ? 'Selecione...' : 'Selecione a Categoria primeiro'}</option>
                   {availableSubCategories.map(sub => (
                     <option key={sub.id} value={sub.id}>{sub.name}</option>
                   ))}
                 </select>
              </div>

              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                 <select className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})}>
                   <option value="un">UN</option>
                   <option value="kg">KG</option>
                   <option value="cx">CX</option>
                 </select>
              </div>

              {/* MODEL, SERIAL NUMBER, STOCK */}
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.model} onChange={e => setProductForm({...productForm, model: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.serialNumber} onChange={e => setProductForm({...productForm, serialNumber: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial (Quantidade)</label>
                 <input type="number" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} />
              </div>

              {/* PRODUCT IMAGES GALLERY */}
              <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Fotos do Produto (Máx. 4)</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((index) => {
                       const hasImage = productForm.images && productForm.images[index];
                       return (
                          <div key={index} className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden group hover:border-blue-400 transition-colors">
                             {hasImage ? (
                                <>
                                   <img src={productForm.images[index]} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                     <button
                                       type="button"
                                       onClick={() => handleRemoveImage(index)}
                                       className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                       title="Remover foto"
                                     >
                                       <Trash2 size={16} />
                                     </button>
                                   </div>
                                </>
                             ) : (
                                <button
                                   type="button"
                                   onClick={handleAddImage}
                                   disabled={index !== (productForm.images?.length || 0)}
                                   className={`flex flex-col items-center justify-center w-full h-full text-gray-400 ${index === (productForm.images?.length || 0) ? 'hover:text-blue-600 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                >
                                   <Camera size={24} className="mb-2" />
                                   <span className="text-xs font-medium">Adicionar Foto</span>
                                </button>
                             )}
                          </div>
                       );
                    })}
                 </div>
                 <p className="text-xs text-gray-500 mt-2">Clique no ícone de câmera para adicionar uma imagem.</p>
              </div>

              <div className="md:col-span-4 border-t border-gray-100 pt-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Financeiro</h3>
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Preço Custo</label>
                 <input type="number" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.purchasePrice} onChange={e => setProductForm({...productForm, purchasePrice: parseFloat(e.target.value)})} />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Margem %</label>
                 <input type="number" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.margin} onChange={e => setProductForm({...productForm, margin: parseFloat(e.target.value)})} />
              </div>
              <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Venda Varejo</label>
                 <input type="number" className="w-full border border-blue-300 bg-blue-50 text-blue-900 rounded-md px-3 py-2 font-semibold" value={productForm.retailPrice} onChange={e => setProductForm({...productForm, retailPrice: parseFloat(e.target.value)})} />
              </div>
              
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Exibir na Loja?</label>
                 <select className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={productForm.showInStore} onChange={e => setProductForm({...productForm, showInStore: e.target.value})}>
                   <option value="yes">Sim</option>
                   <option value="no">Não</option>
                 </select>
              </div>

              <div className="md:col-span-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Produto</button>
              </div>
            </form>
        )}

        {/* === SERVICE FORM IN MODAL === */}
        {activeTab === 'servicos' && (
             <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="md:col-span-3">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
                 <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Preço Venda</label>
                 <input type="number" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
                <div className="md:col-span-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Serviço</button>
              </div>
             </form>
        )}

        {/* === BRAND FORM IN MODAL === */}
        {activeTab === 'marcas' && (
           <form className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca</label>
                  <input type="text" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                  <input type="text" value={brandForm.logo} onChange={e => setBrandForm({...brandForm, logo: e.target.value})} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Marca</button>
               </div>
           </form>
        )}

        {/* === CATEGORY FORM IN MODAL === */}
        {activeTab === 'categorias' && (
            <form className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                  <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Categoria</button>
               </div>
           </form>
        )}

        {/* === SUB-CATEGORY FORM IN MODAL === */}
        {activeTab === 'subcategorias' && (
            <form className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Pai</label>
                 <select 
                    value={subCategoryForm.parentId}
                    onChange={(e) => setSubCategoryForm({...subCategoryForm, parentId: e.target.value})}
                    className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2"
                 >
                   <option value="">Selecione...</option>
                   {categories.map(c => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                   ))}
                 </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Sub-Categoria</label>
                  <input type="text" value={subCategoryForm.name} onChange={e => setSubCategoryForm({...subCategoryForm, name: e.target.value})} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Sub-Categoria</button>
               </div>
           </form>
        )}

        {/* === CHECKLIST BUILDER IN MODAL === */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="col-span-2 md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Modelo de Checklist</label>
                 <input 
                   type="text" 
                   value={checklistForm.name}
                   onChange={e => setChecklistForm({...checklistForm, name: e.target.value})}
                   placeholder="Ex: Instalação de Câmera IP"
                   className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                 />
               </div>
               <div className="col-span-2 md:col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Vincular a um Serviço (Opcional)</label>
                 <select 
                    value={checklistForm.relatedServiceId}
                    onChange={e => setChecklistForm({...checklistForm, relatedServiceId: e.target.value})}
                    className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                   <option value="">Nenhum vínculo (Genérico)</option>
                   {services.map(s => (
                     <option key={s.id} value={s.id}>{s.description}</option>
                   ))}
                 </select>
               </div>
               <div className="col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                 <textarea 
                   rows={2}
                   value={checklistForm.description}
                   onChange={e => setChecklistForm({...checklistForm, description: e.target.value})}
                   className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2"
                 ></textarea>
               </div>
             </div>

             <div className="border-t border-gray-200 pt-4">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-gray-800">Itens de Verificação</h3>
                 <button 
                   type="button" 
                   onClick={addChecklistItem}
                   className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg"
                 >
                   <Plus size={16} /> Adicionar Passo
                 </button>
               </div>

               <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                 {checklistForm.items.length === 0 && (
                   <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
                     Nenhum item adicionado a este checklist.
                   </div>
                 )}
                 {checklistForm.items.map((item, index) => (
                   <div key={item.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200 group">
                      <div className="pt-2 text-gray-400 cursor-move"><GripVertical size={16} /></div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                         <div className="md:col-span-6">
                            <input 
                              type="text" 
                              placeholder="O que deve ser verificado?"
                              value={item.label}
                              onChange={e => updateChecklistItem(index, 'label', e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            />
                         </div>
                         <div className="md:col-span-4">
                            <select 
                              value={item.type}
                              onChange={e => updateChecklistItem(index, 'type', e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 rounded px-2 py-1.5 text-sm"
                            >
                              <option value="checkbox">☑️ Caixa de Seleção</option>
                              <option value="text">📝 Campo de Texto</option>
                              <option value="photo">📸 Foto Obrigatória</option>
                              <option value="file">📎 Anexo de Arquivo</option>
                            </select>
                         </div>
                         <div className="md:col-span-2 flex items-center">
                            <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={item.required}
                                onChange={e => updateChecklistItem(index, 'required', e.target.checked)}
                                className="mr-2 rounded text-blue-600" 
                              />
                              Obrigatório
                            </label>
                         </div>
                      </div>

                      <button 
                        onClick={() => removeChecklistItem(index)}
                        className="text-gray-400 hover:text-red-500 pt-1.5"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                 ))}
               </div>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="button" onClick={saveChecklist} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Modelo</button>
             </div>
          </div>
        )}

      </Modal>
    </div>
  );
};

export default AdminCatalog;
