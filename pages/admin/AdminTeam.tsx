import React, { useState } from 'react';
import { Save, Plus, Search, Trash2, Edit } from 'lucide-react';
import Modal from '../../components/Modal';

type TeamTab = 'usuarios' | 'colaboradores';

const AdminTeam: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeamTab>('usuarios');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock List
  const [users, setUsers] = useState([
    { id: '1', name: 'Admin Principal', email: 'admin@ecosistens.com', role: 'Administrador' },
    { id: '2', name: 'Vendedor Loja', email: 'vendas@ecosistens.com', role: 'Vendedor' }
  ]);
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'Transportadora Express', email: 'contato@express.com', cnpj: '00.000.000/0001-99' }
  ]);

  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  // Simple state for demo form inside modal
  const [formData, setFormData] = useState<any>({
    name: '',
    corporateName: '',
    email: '',
    cpf: '',
    cnpj: '',
    contact: '',
    role: '',
    address: { zipCode: '', street: '', district: '', city: '', state: '', complement: '' }
  });

  const handleOpenModal = (item?: any) => {
    if (item) setFormData({...formData, ...item});
    else setFormData({ name: '', address: { zipCode: '' } }); // Reset partial
    setIsModalOpen(true);
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
    } catch(e) { console.error(e) } finally { setLoadingCep(false); }
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
          email: data.email,
          contact: data.ddd_telefone_1,
          address: {
            ...prev.address,
            zipCode: data.cep,
            street: data.logradouro,
            district: data.bairro,
            city: data.municipio,
            state: data.uf,
            complement: data.complemento
          }
        }));
      }
    } catch(e) { console.error(e) } finally { setLoadingCnpj(false); }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Equipe e Acesso</h1>
        <button 
           onClick={() => handleOpenModal()}
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Novo Cadastro
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-indigo-200 overflow-hidden">
        <div className="flex border-b border-indigo-100">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'usuarios'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Usuários (Sistema)
          </button>
          <button
            onClick={() => setActiveTab('colaboradores')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'colaboradores'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Colaboradores (Empresa)
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-indigo-200 shadow-sm">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider border-b-2 border-indigo-100">Nome</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider border-b-2 border-indigo-100">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider border-b-2 border-indigo-100">
                    {activeTab === 'usuarios' ? 'Cargo' : 'Documento'}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-indigo-700 uppercase tracking-wider border-b-2 border-indigo-100">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-50">
                {activeTab === 'usuarios' ? (
                   users.map(u => (
                     <tr key={u.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                       <td className="px-6 py-4 text-sm font-semibold text-gray-900 group-hover:text-blue-800">{u.name}</td>
                       <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                       <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold">{u.role}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button onClick={() => handleOpenModal(u)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg mr-2 hover:bg-indigo-100 transition-colors"><Edit size={16} /></button>
                         <button className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                       </td>
                     </tr>
                   ))
                ) : (
                   collaborators.map(c => (
                     <tr key={c.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                       <td className="px-6 py-4 text-sm font-semibold text-gray-900 group-hover:text-blue-800">{c.name}</td>
                       <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                       <td className="px-6 py-4 text-sm text-gray-600">{c.cnpj}</td>
                       <td className="px-6 py-4 text-right">
                         <button onClick={() => handleOpenModal(c)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg mr-2 hover:bg-indigo-100 transition-colors"><Edit size={16} /></button>
                         <button className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                       </td>
                     </tr>
                   ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'usuarios' ? 'Cadastro de Usuário' : 'Cadastro de Colaborador'}
        size="lg"
      >
           <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input type="text" disabled value="AUTO" className="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md px-3 py-2 cursor-not-allowed" />
              </div>

              {activeTab === 'usuarios' ? (
                <>
                   <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input type="text" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                   </div>
                   <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                      <select className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2">
                        <option>Administrador</option>
                        <option>Vendedor</option>
                        <option>Estoquista</option>
                      </select>
                   </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <div className="relative">
                      <input type="text" onBlur={e => fetchCnpj(e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md pl-3 pr-8 py-2" />
                       {loadingCnpj && <div className="absolute right-2 top-2.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                     <input type="text" value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                     <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                </>
              )}

              {/* Address */}
              <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
              </div>

               <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <div className="relative">
                  <input type="text" value={formData.address.zipCode} onChange={e => handleAddressChange('zipCode', e.target.value)} onBlur={e => fetchCep(e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
                  {loadingCep && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input type="text" value={formData.address.street} onChange={e => handleAddressChange('street', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input type="text" value={formData.address.city} onChange={e => handleAddressChange('city', e.target.value)} className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-md px-3 py-2" />
              </div>

              <div className="md:col-span-4 flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Cadastro</button>
              </div>
           </form>
      </Modal>
    </div>
  );
};

export default AdminTeam;