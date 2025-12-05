import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, RotateCcw } from 'lucide-react';
import Modal from '../../components/Modal';

type TabType = 'clientes' | 'fornecedores';

// Mock Data for visualization
const MOCK_CLIENTS = [
  { id: '1', name: 'João Silva', email: 'joao@gmail.com', cpf: '123.456.789-00', contact: '(11) 99999-9999', city: 'São Paulo/SP' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@hotmail.com', cpf: '222.333.444-55', contact: '(21) 88888-8888', city: 'Rio de Janeiro/RJ' },
];

const MOCK_SUPPLIERS = [
  { id: '1', name: 'Distribuidora Tech', corporate: 'Tech Dist. LTDA', email: 'contato@tech.com', cnpj: '00.000.000/0001-00', contact: '(11) 3333-3333' },
  { id: '2', name: 'Audio Systems', corporate: 'Audio Sys. S.A.', email: 'vendas@audiosys.com', cnpj: '11.111.111/0001-11', contact: '(41) 3030-3030' },
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
    address: {
      zipCode: '',
      street: '',
      district: '',
      city: '',
      state: '',
      complement: '',
      number: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (data?: any) => {
    if (data) {
      // Populate for edit (mock mapping)
      setFormData({ ...initialFormState, ...data });
    } else {
      // Reset for new
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      address: { ...prev.address, [field]: value }
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
        setFormData((prev: any) => ({
          ...prev,
          address: {
            ...prev.address,
            street: data.logradouro,
            district: data.bairro,
            city: data.localidade,
            state: data.uf,
            zipCode: cep
          }
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
          address: {
            ...prev.address,
            zipCode: data.cep,
            street: data.logradouro,
            district: data.bairro,
            city: data.municipio,
            state: data.uf,
            complement: data.complemento,
            number: data.numero
          }
        }));
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Novo Cadastro
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'clientes'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setActiveTab('fornecedores')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'fornecedores'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fornecedores
          </button>
        </div>

        {/* Search & List */}
        <div className="p-6">
          <div className="relative mb-6">
             <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
             <input 
               type="text" 
               placeholder={`Buscar ${activeTab}...`} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
             />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Razão</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato / Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'clientes' ? (
                   MOCK_CLIENTS.map(item => (
                     <tr key={item.id}>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-gray-900">{item.name}</div>
                         <div className="text-sm text-gray-500">{item.city}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{item.email}</div>
                         <div className="text-sm text-gray-500">{item.contact}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cpf}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-900 mr-3"><Edit size={16}/></button>
                         <button className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                       </td>
                     </tr>
                   ))
                ) : (
                   MOCK_SUPPLIERS.map(item => (
                     <tr key={item.id}>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-gray-900">{item.corporate}</div>
                         <div className="text-sm text-gray-500">{item.name}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{item.email}</div>
                         <div className="text-sm text-gray-500">{item.contact}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cnpj}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-900 mr-3"><Edit size={16}/></button>
                         <button className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
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

            {/* Address Section */}
            <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.address.zipCode}
                  onChange={e => handleAddressChange('zipCode', e.target.value)}
                  onBlur={e => fetchCep(e.target.value)}
                  placeholder="00000-000"
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                {loadingCep && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro / Endereço</label>
              <input type="text" value={formData.address.street} onChange={e => handleAddressChange('street', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input type="text" value={formData.address.number} onChange={e => handleAddressChange('number', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input type="text" value={formData.address.district} onChange={e => handleAddressChange('district', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input type="text" value={formData.address.complement} onChange={e => handleAddressChange('complement', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input type="text" value={formData.address.city} onChange={e => handleAddressChange('city', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

             <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
              <input type="text" value={formData.address.state} onChange={e => handleAddressChange('state', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
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
               <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Salvar Cadastro</button>
            </div>
          </form>
      </Modal>
    </div>
  );
};

export default AdminClients;