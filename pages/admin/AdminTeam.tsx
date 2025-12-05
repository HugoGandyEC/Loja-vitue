import React, { useState } from 'react';
import { Save } from 'lucide-react';

type TeamTab = 'usuarios' | 'colaboradores';

const AdminTeam: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeamTab>('usuarios');
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  // Simple state for demo
  const [formData, setFormData] = useState<any>({
    address: { zipCode: '', street: '', district: '', city: '', state: '', complement: '' }
  });

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
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save size={18} /> Salvar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'usuarios'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Usuários (Sistema)
          </button>
          <button
            onClick={() => setActiveTab('colaboradores')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'colaboradores'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Colaboradores (Empresa)
          </button>
        </div>

        <div className="p-6">
           <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input type="text" disabled value="AUTO" className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2" />
              </div>

              {activeTab === 'usuarios' ? (
                <>
                   <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                   <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                   <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                   <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ (Busca Auto)</label>
                    <div className="relative">
                      <input type="text" onBlur={e => fetchCnpj(e.target.value)} className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-2" placeholder="Se PJ..." />
                       {loadingCnpj && <div className="absolute right-2 top-2.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social / Nome</label>
                     <input type="text" value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição / CPF</label>
                     <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                     <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                     <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2" />
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
                  <input type="text" value={formData.address.zipCode} onChange={e => handleAddressChange('zipCode', e.target.value)} onBlur={e => fetchCep(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  {loadingCep && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input type="text" value={formData.address.street} onChange={e => handleAddressChange('street', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input type="text" value={formData.address.district} onChange={e => handleAddressChange('district', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input type="text" value={formData.address.complement} onChange={e => handleAddressChange('complement', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input type="text" value={formData.address.city} onChange={e => handleAddressChange('city', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>

              {activeTab === 'colaboradores' && (
                <>
                   <div className="md:col-span-4 border-t border-gray-100 pt-4 mt-2">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Vendedor(a)</h3>
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                   <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                   <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                   </div>
                </>
              )}
           </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTeam;