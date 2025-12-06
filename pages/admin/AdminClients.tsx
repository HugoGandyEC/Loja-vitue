import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, MapPin, X } from 'lucide-react';
import Modal from '../../components/Modal';
import { AdminClient, AdminSupplier, Address } from '../../types';

type TabType = 'clientes' | 'fornecedores';

// Mock Data for visualization
const MOCK_CLIENTS: AdminClient[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao@gmail.com', 
    cpf: '123.456.789-00', 
    contact: '(11) 99999-9999', 
    rg: '12.345.678-9',
    addresses: [
      { zipCode: '01001-000', street: 'Praça da Sé', number: '10', district: 'Sé', city: 'São Paulo', state: 'SP', label: 'Principal' }
    ] 
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    email: 'maria@hotmail.com', 
    cpf: '222.333.444-55', 
    contact: '(21) 88888-8888', 
    rg: '98.765.432-1',
    addresses: [
       { zipCode: '20040-002', street: 'Rua da Assembleia', number: '50', district: 'Centro', city: 'Rio de Janeiro', state: 'RJ', label: 'Trabalho' }
    ] 
  },
];

const MOCK_SUPPLIERS: AdminSupplier[] = [
  { 
    id: '1', 
    name: 'Distribuidora Tech', 
    corporateName: 'Tech Dist. LTDA', 
    email: 'contato@tech.com', 
    cnpj: '00.000.000/0001-00', 
    contact: '(11) 3333-3333', 
    stateRegistration: '123123',
    sellerName: 'Carlos',
    sellerContact: '9999-9999',
    sellerEmail: 'carlos@tech.com',
    addresses: [
      { zipCode: '01001-000', street: 'Av Paulista', number: '1000', district: 'Bela Vista', city: 'São Paulo', state: 'SP', label: 'Matriz' }
    ]
  },
  { 
    id: '2', 
    name: 'Audio Systems', 
    corporateName: 'Audio Sys. S.A.', 
    email: 'vendas@audiosys.com', 
    cnpj: '11.111.111/0001-11', 
    contact: '(41) 3030-3030',
    stateRegistration: '456456',
    sellerName: 'Ana',
    sellerContact: '8888-8888',
    sellerEmail: 'ana@audiosys.com',
    addresses: [
      { zipCode: '80000-000', street: 'Rua XV de Novembro', number: '200', district: 'Centro', city: 'Curitiba', state: 'PR', label: 'Filial' }
    ] 
  },
];

const AdminClients: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clientes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for API calls inside Modal
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  // Form Data State
  const initialFormState = {
    id: 'AUTO',
    name: '',
    corporateName: '', // Razão Social
    email: '',
    contact: '',
    rg: '',
    cpf: '',
    cnpj: '',
    inscription: '',
    sellerName: '',
    sellerEmail: '',
    sellerContact: '',
    addresses: [] as Address[]
  };

  const initialAddressState: Address = {
    zipCode: '',
    street: '',
    district: '',
    city: '',
    state: '',
    complement: '',
    number: '',
    label: 'Principal'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [currentAddress, setCurrentAddress] = useState<Address>(initialAddressState);

  const handleOpenModal = (data?: any) => {
    if (data) {
      // Populate for edit (mock mapping)
      setFormData({ 
        ...initialFormState, 
        ...data,
        addresses: data.addresses || [] // Ensure addresses array exists
      });
    } else {
      // Reset for new
      setFormData(initialFormState);
    }
    setCurrentAddress(initialAddressState);
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Updates the temporary address inputs
  const handleCurrentAddressChange = (field: string, value: string) => {
    setCurrentAddress(prev => ({ ...prev, [field]: value }));
  };

  // Adds the current address to the client's address list
  const handleAddAddress = () => {
    if (!currentAddress.street || !currentAddress.city) {
      alert("Preencha pelo menos a Rua e a Cidade para adicionar um endereço.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, currentAddress]
    }));
    setCurrentAddress(initialAddressState); // Reset inputs
  };

  // Removes an address from the list
  const handleRemoveAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setCurrentAddress(prev => ({
          ...prev,
          street: data.logradouro,
          district: data.bairro,
          city: data.localidade,
          state: data.uf,
          zipCode: cep
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const fetchCnpj = async (cnpj: string) => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    if (cleanCnpj.length !== 14) return;

    setLoadingCnpj(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      const data = await response.json();
      
      if (data.cnpj) {
        setFormData((prev: any) => ({
          ...prev,
          corporateName: data.razao_social,
          name: data.nome_fantasia || data.razao_social, // For Fantasia
          email: data.email,
          contact: data.ddd_telefone_1,
        }));

        // Automatically fill address fields for convenience, user still needs to click "Add"
        setCurrentAddress({
          zipCode: data.cep,
          street: data.logradouro,
          district: data.bairro,
          city: data.municipio,
          state: data.uf,
          complement: data.complemento,
          number: data.numero,
          label: 'Matriz'
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CNPJ", error);
    } finally {
      setLoadingCnpj(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Parceiros</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus size={18} /> Novo Cadastro
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-indigo-200 overflow-hidden">
        <div className="flex border-b border-indigo-100">
          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'clientes'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setActiveTab('fornecedores')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'fornecedores'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Fornecedores
          </button>
        </div>

        {/* Search & List */}
        <div className="p-6">
          <div className="relative mb-6">
             <Search className="absolute left-3 top-2.5 text-indigo-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder={`Buscar ${activeTab}...`} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 border border-indigo-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
             />
          </div>

          <div className="overflow-x-auto rounded-xl border border-indigo-200 shadow-xl bg-white">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Nome / Razão</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Contato / Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Cidade (Principal)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">Documento</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-white">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-50">
                {activeTab === 'clientes' ? (
                   MOCK_CLIENTS.map(item => (
                     <tr key={item.id} className="transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:z-10 relative border-l-4 border-l-transparent hover:border-l-blue-500">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">{item.name}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{item.email}</div>
                         <div className="text-sm text-gray-500">{item.contact}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.addresses?.[0]?.city ? `${item.addresses[0].city}/${item.addresses[0].state}` : '-'}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.cpf}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 bg-white border border-indigo-200 p-2 rounded-lg mr-2 hover:bg-indigo-50 transition-colors shadow-sm"><Edit size={16}/></button>
                         <button className="text-red-500 hover:text-red-700 bg-white border border-red-200 p-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm"><Trash2 size={16}/></button>
                       </td>
                     </tr>
                   ))
                ) : (
                   MOCK_SUPPLIERS.map(item => (
                     <tr key={item.id} className="transition-all duration-300 group hover:shadow-lg hover:scale-[1.01] hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:z-10 relative border-l-4 border-l-transparent hover:border-l-blue-500">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">{item.corporateName}</div>
                         <div className="text-sm text-gray-500">{item.name}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{item.email}</div>
                         <div className="text-sm text-gray-500">{item.contact}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                         {item.addresses?.[0]?.city ? `${item.addresses[0].city}/${item.addresses[0].state}` : '-'}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.cnpj}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 bg-white border border-indigo-200 p-2 rounded-lg mr-2 hover:bg-indigo-50 transition-colors shadow-sm"><Edit size={16}/></button>
                         <button className="text-red-500 hover:text-red-700 bg-white border border-red-200 p-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm"><Trash2 size={16}/></button>
                       </td>
                     </tr>
                   ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'clientes' ? "Cadastro de Cliente" : "Cadastro de Fornecedor"}
        size="lg"
      >
        <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Common Fields: ID */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input type="text" disabled value={formData.id} className="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-not-allowed" />
            </div>

            {/* Conditional Fields based on Tab */}
            {activeTab === 'clientes' ? (
              <>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input type="text" value={formData.cpf} onChange={e => handleInputChange('cpf', e.target.value)} placeholder="000.000.000-00" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                  <input type="text" value={formData.rg} onChange={e => handleInputChange('rg', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </>
            ) : (
              <>
                 <div className="md:col-span-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={e => handleInputChange('cnpj', e.target.value)}
                      onBlur={(e) => fetchCnpj(e.target.value)}
                      className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {loadingCnpj && <div className="absolute right-2 top-2.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                  <input 
                    type="text" 
                    value={formData.corporateName} 
                    onChange={e => handleInputChange('corporateName', e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
                  <input type="text" value={formData.inscription} onChange={e => handleInputChange('inscription', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                  <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contato (Telefone/Celular)</label>
              <input 
                type="text" 
                value={formData.contact} 
                onChange={e => handleInputChange('contact', e.target.value)}
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            {/* === MULTI-ADDRESS MANAGEMENT SECTION === */}
            <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                   <MapPin size={20} className="text-blue-600" /> Endereços Cadastrados
                 </h3>
                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{formData.addresses.length}</span>
               </div>

               {/* Address List */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 {formData.addresses.map((addr, idx) => (
                   <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 relative group hover:border-blue-300 transition-colors shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mb-1 inline-block">{addr.label || 'Endereço'}</span>
                          <p className="text-sm font-medium text-gray-800">{addr.street}, {addr.number}</p>
                          <p className="text-xs text-gray-500">{addr.district} - {addr.city}/{addr.state}</p>
                          <p className="text-xs text-gray-400">CEP: {addr.zipCode}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveAddress(idx)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remover Endereço"
                        >
                          <X size={16} />
                        </button>
                      </div>
                   </div>
                 ))}
                 {formData.addresses.length === 0 && (
                   <div className="col-span-2 text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
                     Nenhum endereço vinculado. Adicione um abaixo.
                   </div>
                 )}
               </div>

               {/* Add Address Form */}
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Adicionar Novo Endereço</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rótulo (Ex: Casa, Entrega)</label>
                      <input 
                        type="text" 
                        value={currentAddress.label}
                        onChange={e => handleCurrentAddressChange('label', e.target.value)}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" 
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">CEP</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={currentAddress.zipCode}
                          onChange={e => handleCurrentAddressChange('zipCode', e.target.value)}
                          onBlur={e => fetchCep(e.target.value)}
                          placeholder="00000-000"
                          className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" 
                        />
                        {loadingCep && <div className="absolute right-3 top-2 w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rua / Logradouro</label>
                      <input type="text" value={currentAddress.street} onChange={e => handleCurrentAddressChange('street', e.target.value)} className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Número</label>
                      <input type="text" value={currentAddress.number} onChange={e => handleCurrentAddressChange('number', e.target.value)} className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Bairro</label>
                      <input type="text" value={currentAddress.district} onChange={e => handleCurrentAddressChange('district', e.target.value)} className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                     <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
                      <input type="text" value={currentAddress.city} onChange={e => handleCurrentAddressChange('city', e.target.value)} className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                     <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">UF</label>
                      <input type="text" value={currentAddress.state} onChange={e => handleCurrentAddressChange('state', e.target.value)} className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                     <div className="md:col-span-4 flex justify-end">
                       <button 
                         type="button" 
                         onClick={handleAddAddress}
                         className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                       >
                         <Plus size={16} /> Adicionar Endereço à Lista
                       </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Supplier Specific: Seller Info */}
            {activeTab === 'fornecedores' && (
              <>
                 <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Vendedor(a)</h3>
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Vendedor</label>
                    <input type="text" value={formData.sellerName} onChange={e => handleInputChange('sellerName', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                 </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={formData.sellerEmail} onChange={e => handleInputChange('sellerEmail', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                 </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                    <input type="text" value={formData.sellerContact} onChange={e => handleInputChange('sellerContact', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                 </div>
              </>
            )}

            <div className="md:col-span-4 flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
               <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Salvar Cadastro Completo</button>
            </div>
          </form>
      </Modal>
    </div>
  );
};

export default AdminClients;