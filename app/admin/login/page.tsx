'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const router = useRouter();

  const fazerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senha === 'Fr@n_Artes#2026') {
      document.cookie = "admin_session=true; path=/; max-age=86400";
      router.push('/admin'); 
    } else {
      setErro(true);
      setSenha('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-stone-200">
        <h1 className="text-2xl font-bold text-center text-[#B76E79] mb-2">Painel da Fran</h1>
        <p className="text-sm text-stone-600 text-center mb-6">Digite a senha para acessar as mensagens</p>

        <form onSubmit={fazerLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro(false);
              }}
              placeholder="Sua senha secreta..."
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-medium placeholder-stone-500 outline-none focus:border-[#B76E79] focus:bg-white transition-colors"
            />
            {erro && <p className="text-red-600 text-sm mt-2 ml-1 font-medium">Senha incorreta, tente novamente.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#B76E79] hover:bg-[#a05a66] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}