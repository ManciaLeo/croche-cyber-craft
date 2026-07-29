'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Settings, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminConfiguracoes() {
  const [gtmId, setGtmId] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  // Carrega a configuração atual do banco
  useEffect(() => {
    const carregarConfig = async () => {
      const { data } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('chave', 'gtm_id')
        .single();
      
      if (data) {
        setGtmId(data.valor);
      }
    };
    carregarConfig();
  }, []);

  // Salva ou atualiza o GTM no banco
  const salvarConfiguracao = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    // Verifica se já existe a chave gtm_id cadastrada
    const { data: existente } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('chave', 'gtm_id')
      .single();

    let error;
    if (existente) {
      // Atualiza
      const res = await supabase
        .from('configuracoes')
        .update({ valor: gtmId })
        .eq('chave', 'gtm_id');
      error = res.error;
    } else {
      // Insere novo
      const res = await supabase
        .from('configuracoes')
        .insert([{ chave: 'gtm_id', valor: gtmId }]);
      error = res.error;
    }

    setSalvando(false);
    if (!error) {
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
        
        {/* Cabeçalho */}
        <div className="bg-[#B76E79] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <h1 className="text-xl font-bold">Configurações de Rastreamento</h1>
          </div>
          <Link href="/admin" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-sm transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        {/* Formulário */}
        <form onSubmit={salvarConfiguracao} className="p-6 md:p-8 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">
              ID do Google Tag Manager (GTM)
            </label>
            <p className="text-xs text-stone-500 mb-3">
              Insira apenas o código identificador (ex: GTM-XXXXXXX). Ele será injetado automaticamente em todas as páginas do site da Fran.
            </p>
            <input 
              type="text"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              placeholder="Ex: GTM-ABC1234"
              className="w-full bg-stone-50 text-stone-900 border border-stone-300 rounded-xl px-4 py-3 outline-none focus:border-[#B76E79] focus:bg-white transition-colors"
            />
          </div>

          {sucesso && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              Configurações salvas com sucesso!
            </div>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="bg-[#B76E79] hover:bg-[#a05a66] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>

      </div>
    </div>
  );
}