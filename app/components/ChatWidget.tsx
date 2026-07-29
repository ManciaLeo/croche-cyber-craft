'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ChatWidget() {
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const mensagensFimRef = useRef<HTMLDivElement>(null);

  // Inicia a sessão do cliente para separar as conversas
  useEffect(() => {
    // Procura se o cliente já tem um ID salvo no navegador
    let id = localStorage.getItem('fran_chat_session');
    if (!id) {
      // Se não tem, cria um ID único novo e salva
      id = 'cliente_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('fran_chat_session', id);
    }
    setSessionId(id);

    const buscarMensagens = async () => {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('session_id', id) // Busca só as mensagens DESTE cliente
        .order('created_at', { ascending: true });
        
      if (data) setMensagens(data);
      if (error) console.error("Erro ao buscar:", error);
    };

    buscarMensagens();

    // Escuta novas mensagens em tempo real
    const canal = supabase
      .channel('chat_cliente')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens' }, 
        (payload) => {
          // Só coloca na tela se a mensagem pertencer a esta sessão
          if (payload.new.session_id === id) {
            setMensagens((atual) => {
              if (atual.find((m) => m.id === payload.new.id)) return atual;
              return [...atual, payload.new];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, aberto]);

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim() || !sessionId) return;

    const textoEnvio = mensagem;
    setMensagem(''); 

    const { data, error } = await supabase
      .from('mensagens')
      .insert([{ 
        texto: textoEnvio, 
        enviado_por: 'cliente',
        session_id: sessionId // Salva a mensagem com o "crachá" do cliente
      }])
      .select();

    if (error) {
      console.error("Erro ao salvar mensagem:", error);
      return;
    }

    if (data) {
      setMensagens((atual) => {
        if (atual.find((m) => m.id === data[0].id)) return atual;
        return [...atual, data[0]];
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!aberto && (
        <button 
          onClick={() => setAberto(true)}
          className="bg-[#B76E79] hover:bg-[#a05a66] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {aberto && (
        <div className="bg-white w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-[#B76E79] p-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold">Fale com a Fran</h3>
              <p className="text-xs text-white/80">Respondemos rapidinho!</p>
            </div>
            <button onClick={() => setAberto(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-stone-50 flex flex-col gap-3">
            {mensagens.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.enviado_por === 'cliente' 
                    ? 'bg-[#B76E79] text-white self-end rounded-tr-sm' 
                    : 'bg-white text-black border border-stone-200 self-start rounded-tl-sm'
                }`}
              >
                {msg.texto}
              </div>
            ))}
            <div ref={mensagensFimRef} />
          </div>

          <form onSubmit={enviarMensagem} className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input 
              type="text" 
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-stone-100 text-black rounded-xl px-4 py-2 text-sm outline-none border border-transparent focus:border-[#B76E79] focus:bg-white transition-colors"
            />
            <button 
              type="submit" 
              disabled={!mensagem.trim()}
              className="bg-[#B76E79] text-white p-2 rounded-xl hover:bg-[#a05a66] disabled:opacity-50 disabled:hover:bg-[#B76E79] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}