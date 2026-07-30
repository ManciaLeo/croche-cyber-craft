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
  const [imagemUrl, setImagemUrl] = useState("");

  // Função para buscar os produtos no Supabase
  const fetchProdutos = async () => {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setProdutos(data);
  };

  // Carrega os produtos assim que a tela abre
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Função disparada ao enviar o formulário
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("produtos").insert([
      {
        nome,
        descricao,
        preco: parseFloat(preco.replace(",", ".")), // Garante que o preço vá como número
        imagem_url: imagemUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Erro ao salvar produto: " + error.message);
    } else {
      setIsModalOpen(false); // Fecha o modal
      setNome(""); setDescricao(""); setPreco(""); setImagemUrl(""); // Limpa os campos
      fetchProdutos(); // Atualiza a lista na tela instantaneamente
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Painel Administrativo - Produtos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Adicionar Produto
        </button>
      </div>

      {/* Tabela/Lista de Produtos Cadastrados */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        {produtos.length === 0 ? (
          <p className="p-6 text-stone-500 text-center">Nenhum produto cadastrado ainda.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-200">
                <th className="p-4 font-semibold text-stone-700">Nome da Peça</th>
                <th className="p-4 font-semibold text-stone-700">Preço</th>
                <th className="p-4 font-semibold text-stone-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-4 text-stone-800">{produto.nome}</td>
                  <td className="p-4 text-stone-600">R$ {produto.preco}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Em estoque
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-800">Nova Peça</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-xl"
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
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none"
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
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none"
                  placeholder="Ex: 150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Link da Imagem</label>
                <input
                  type="url"
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none"
                  placeholder="https://link-da-foto.com/imagem.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none"
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
                  className="px-4 py-2 bg-stone-800 text-white rounded-md font-medium hover:bg-stone-700 disabled:opacity-50"
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