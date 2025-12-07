import React, { useState } from 'react';
import { Calendar, Package, MapPin, RotateCcw, Filter, Download, MoreVertical } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [dateRange, setDateRange] = useState('Últimos 30 dias');
    const [category, setCategory] = useState('Todas as Categorias');
    const [region, setRegion] = useState('Todas as Regiões');

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-6">Visão Geral de Vendas e Desempenho</h1>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    {/* Date Range */}
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-2.5 border border-slate-800">
                        <Calendar size={18} className="text-slate-400" />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent text-white text-sm outline-none cursor-pointer"
                        >
                            <option value="Last 7 Days">Últimos 7 dias</option>
                            <option value="Last 30 Days">Últimos 30 dias</option>
                            <option value="Last 90 Days">Últimos 90 dias</option>
                            <option value="Last Year">Último Ano</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-2.5 border border-slate-800">
                        <Package size={18} className="text-slate-400" />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-transparent text-white text-sm outline-none cursor-pointer"
                        >
                            <option value="All Categories">Todas as Categorias</option>
                            <option value="Electronics">Eletrônicos</option>
                            <option value="Apparel">Vestuário</option>
                            <option value="Home Goods">Bens de Casa</option>
                            <option value="Books">Livros</option>
                        </select>
                    </div>

                    {/* Region */}
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-2.5 border border-slate-800">
                        <MapPin size={18} className="text-slate-400" />
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="bg-transparent text-white text-sm outline-none cursor-pointer"
                        >
                            <option value="All Regions">Todas as Regiões</option>
                            <option value="North">Norte</option>
                            <option value="South">Sul</option>
                            <option value="East">Leste</option>
                            <option value="West">Oeste</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <button className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-2.5 border border-slate-800 hover:bg-slate-800 transition-colors">
                        <RotateCcw size={18} />
                        <span className="text-sm">Resetar</span>
                    </button>

                    {/* Apply Button */}
                    <button className="flex items-center gap-2 bg-blue-600 rounded-lg px-4 py-2.5 hover:bg-blue-700 transition-colors">
                        <Filter size={18} />
                        <span className="text-sm font-medium">Aplicar</span>
                    </button>

                    {/* Export Button */}
                    <button className="flex items-center gap-2 bg-slate-900 rounded-lg px-4 py-2.5 border border-slate-800 hover:bg-slate-800 transition-colors ml-auto">
                        <Download size={18} />
                        <span className="text-sm">Exportar</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Sales */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Vendas Totais</div>
                    <div className="text-3xl font-bold mb-1">R$ 124.560</div>
                    <div className="text-green-500 text-sm">+1.2%</div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Taxa de Conversão</div>
                    <div className="text-3xl font-bold mb-1">12.5%</div>
                    <div className="text-red-500 text-sm">-0.5%</div>
                </div>

                {/* Average Order Value */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Valor Médio do Pedido</div>
                    <div className="text-3xl font-bold mb-1">R$ 256,70</div>
                    <div className="text-green-500 text-sm">+2.1%</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue by Product Category */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Receita por Categoria de Produto</h3>
                            <p className="text-slate-400 text-sm">Últimos 30 Dias</p>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Donut Chart */}
                        <div className="relative w-64 h-64">
                            <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                {/* Electronics - 40% - Cyan */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    fill="none"
                                    stroke="#06B6D4"
                                    strokeWidth="40"
                                    strokeDasharray="175.93 439.82"
                                    strokeDashoffset="0"
                                />
                                {/* Apparel - 30% - Purple */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    fill="none"
                                    stroke="#A855F7"
                                    strokeWidth="40"
                                    strokeDasharray="131.95 439.82"
                                    strokeDashoffset="-175.93"
                                />
                                {/* Home Goods - 20% - Teal */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    fill="none"
                                    stroke="#14B8A6"
                                    strokeWidth="40"
                                    strokeDasharray="87.96 439.82"
                                    strokeDashoffset="-307.88"
                                />
                                {/* Books - 10% - Orange */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    fill="none"
                                    stroke="#F97316"
                                    strokeWidth="40"
                                    strokeDasharray="43.98 439.82"
                                    strokeDashoffset="-395.84"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs">Receita Total</div>
                                <div className="text-2xl font-bold">R$ 58.230</div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <span className="text-sm text-slate-300">Eletrônicos</span>
                                <span className="text-sm font-semibold ml-auto">40%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-slate-300">Vestuário</span>
                                <span className="text-sm font-semibold ml-auto">30%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                                <span className="text-sm text-slate-300">Bens de Casa</span>
                                <span className="text-sm font-semibold ml-auto">20%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm text-slate-300">Livros</span>
                                <span className="text-sm font-semibold ml-auto">10%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Site Traffic */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">Tráfego Diário do Site</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">1,2M Visitantes</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-400 text-sm">Últimos 30 Dias</span>
                            <span className="text-red-500 text-sm">-1.8%</span>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="h-48 relative">
                        <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area under the line */}
                            <path
                                d="M 0 80 L 30 60 L 60 90 L 90 50 L 120 70 L 150 40 L 180 75 L 210 45 L 240 85 L 270 30 L 300 65 L 330 55 L 360 90 L 400 70 L 400 150 L 0 150 Z"
                                fill="url(#lineGradient)"
                            />

                            {/* Line */}
                            <path
                                d="M 0 80 L 30 60 L 60 90 L 90 50 L 120 70 L 150 40 L 180 75 L 210 45 L 240 85 L 270 30 L 300 65 L 330 55 L 360 90 L 400 70"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Monthly New Users */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Novos Usuários Mensais</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">1.500</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-400 text-sm">Últimos 6 Meses</span>
                        <span className="text-red-500 text-sm">-0.2%</span>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="h-32 flex items-end gap-4">
                    <div className="flex-1 bg-slate-800 rounded-t" style={{ height: '60%' }}></div>
                    <div className="flex-1 bg-slate-800 rounded-t" style={{ height: '45%' }}></div>
                    <div className="flex-1 bg-slate-800 rounded-t" style={{ height: '70%' }}></div>
                    <div className="flex-1 bg-slate-800 rounded-t" style={{ height: '55%' }}></div>
                    <div className="flex-1 bg-slate-800 rounded-t" style={{ height: '80%' }}></div>
                    <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '90%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
