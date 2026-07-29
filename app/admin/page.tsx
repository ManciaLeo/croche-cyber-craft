'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  MousePointerClick, 
  Activity, 
  ImageIcon, 
  Upload, 
  Edit, 
  Trash2, 
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// --- DADOS MOCKADOS PARA OS GRÁFICOS ---
const acessosData = [
  { name: 'Seg', acessos: 120 }, { name: 'Ter', acessos: 150 },
  { name: 'Qua', acessos: 180 }, { name: 'Qui', acessos: 140 },
  { name: 'Sex', acessos: 210 }, { name: 'Sáb', acessos: 350 },
  { name: 'Dom', acessos: 310 },
];

const leadsData = [
  { name: 'Instagram', value: 55, color: '#E1306C' },
  { name: 'Busca Google', value: 25, color: '#4285F4' },
  { name: 'Link Direto', value: 15, color: '#10B981' },
  { name: 'Outros', value: 5, color: '#6B7280' },
];

// --- DADOS MOCKADOS PARA PRONTA ENTREGA ---
const initialProntaEntrega = [
  { id: 1, title: 'Tapete Oval Rosé', price: 'R$ 120,00', image: '/img/croche.png' },
  { id: 2, title: 'Trilho de Mesa Dourado', price: 'R$ 180,00', image: '/img/croche2.png' },
];

export default function AdminDashboard() {
  const [items, setItems] = useState(initialProntaEntrega);

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800 flex">
      
      {/* --- MENU LATERAL (SIDEBAR) --- */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col fixed h-full">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-xl font-bold text-white tracking-tight">Fran Admin</h2>
          <p className="text-xs text-stone-500 mt-1">Painel de Controle</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 bg-[#B76E79] text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          <Link 
            href="/admin/inbox" 
            className="flex items-center gap-3 text-stone-300 hover:bg-stone-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Inbox de Mensagens
          </Link>

          <Link 
            href="/admin/configuracoes" 
            className="flex items-center gap-3 text-stone-300 hover:bg-stone-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            Configurações GTM
          </Link>

          <Link 
            href="/" 
            className="flex items-center gap-3 text-stone-300 hover:bg-stone-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors mt-auto"
          >
            <Home className="w-5 h-5" />
            Ver Site
          </Link>
        </nav>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="ml-64 flex-1 p-8 h-screen overflow-y-auto">
        
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Visão Geral</h1>
            <p className="text-stone-500">Acompanhe o desempenho do site e gerencie produtos.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-stone-700">3 usuários online agora</span>
          </div>
        </header>

        {/* --- CARDS DE ESTATÍSTICAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Acessos na Semana</p>
              <h3 className="text-2xl font-bold text-stone-800">1.470</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-4 bg-pink-50 text-pink-600 rounded-xl">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Cliques no WhatsApp</p>
              <h3 className="text-2xl font-bold text-stone-800">84</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Taxa de Conversão</p>
              <h3 className="text-2xl font-bold text-stone-800">5.7%</h3>
            </div>
          </div>
        </div>

        {/* --- GRÁFICOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Gráfico de Linha (Acessos) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-stone-800 mb-6">Tráfego de Acessos (Últimos 7 dias)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={acessosData}>
                  <defs>
                    <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B76E79" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#B76E79" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="acessos" stroke="#B76E79" strokeWidth={3} fillOpacity={1} fill="url(#colorAcessos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Pizza (Origem dos Leads) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-lg font-bold text-stone-800 mb-6">Origem dos Leads</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- GERENCIAMENTO DE PRONTA ENTREGA --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-stone-800">Gerenciar Pronta Entrega</h3>
            <button className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
              <Upload className="w-4 h-4" />
              Novo Produto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-sm text-stone-500">
                  <th className="pb-3 font-medium">Imagem</th>
                  <th className="pb-3 font-medium">Nome do Produto</th>
                  <th className="pb-3 font-medium">Preço</th>
                  <th className="pb-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-4">
                      <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 font-medium text-stone-800">{item.title}</td>
                    <td className="py-4 text-stone-600">{item.price}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="p-2 text-stone-400 hover:text-blue-600 bg-stone-100 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-stone-400 hover:text-red-600 bg-stone-100 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}