"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);

  const fetchProdutos = async () => {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setProdutos(data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let urlDaImagem = "";

    // 1. Faz o upload da imagem se o usuário tiver selecionado uma
    if (imagemFile) {
      // Cria um nome único para o arquivo para não dar conflito
      const fileExt = imagemFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(fileName, imagemFile);

      if (uploadError) {
        alert("Erro ao fazer upload da imagem: " + uploadError.message);
        setLoading(false);
        return;
      }

      // 2. Pega o link público da imagem que acabou de subir
      const { data } = supabase.storage
        .from('produtos')
        .getPublicUrl(fileName);
        
      urlDaImagem = data.publicUrl;
    }

    // 3. Salva o produto no banco de dados com o link da imagem
    const { error } = await supabase.from("produtos").insert([
      {
        nome,
        descricao,
        preco: parseFloat(preco.replace(",", ".")), 
        imagem_url: urlDaImagem,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Erro ao salvar produto: " + error.message);
    } else {
      setIsModalOpen(false); 
      setNome(""); setDescricao(""); setPreco(""); setImagemFile(null); 
      fetchProdutos(); 
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Painel Administrativo - Produtos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-200 hover:bg-white text-stone-900 px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Adicionar Produto
        </button>
      </div>

      <div className="bg-stone-800 rounded-lg shadow-sm border border-stone-700 overflow-hidden">
        {produtos.length === 0 ? (
          <p className="p-6 text-stone-200 text-center">Nenhum produto cadastrado ainda.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-900 border-b border-stone-700">
                <th className="p-4 font-semibold text-stone-200">Nome da Peça</th>
                <th className="p-4 font-semibold text-stone-200">Preço</th>
                <th className="p-4 font-semibold text-stone-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-b border-stone-700 hover:bg-stone-700">
                  <td className="p-4 text-white">{produto.nome}</td>
                  <td className="p-4 text-stone-300">R$ {produto.preco}</td>
                  <td className="p-4">
                    <span className="bg-green-900 text-green-100 text-xs px-2 py-1 rounded-full border border-green-700">
                      Em estoque
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-900">Nova Peça</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-500 hover:text-stone-800 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome da peça</label>
                <input
                  required
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none text-black placeholder:text-stone-400 bg-white"
                  placeholder="Ex: Jogo de Banheiro Crudo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Preço (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none text-black placeholder:text-stone-400 bg-white"
                  placeholder="Ex: 150.00"
                />
              </div>

              {/* AQUI ESTÁ A MÁGICA DO UPLOAD */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Foto da Peça</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImagemFile(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-stone-300 rounded-md p-2 text-stone-700 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none text-black placeholder:text-stone-400 bg-white"
                  placeholder="Detalhes sobre a linha, tamanho..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-md font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}