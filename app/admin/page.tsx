"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados do formulário e controle de edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemAtualUrl, setImagemAtualUrl] = useState("");

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

  // Abre o modal para criar um novo produto
  const handleOpenNewModal = () => {
    setEditingId(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setImagemFile(null);
    setImagemAtualUrl("");
    setIsModalOpen(true);
  };

  // Abre o modal já preenchido para editar um produto existente
  const handleOpenEditModal = (produto: any) => {
    setEditingId(produto.id);
    setNome(produto.nome || "");
    setDescricao(produto.descricao || "");
    setPreco(produto.preco ? produto.preco.toString() : "");
    setImagemAtualUrl(produto.imagem_url || "");
    setImagemFile(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let urlDaImagem = imagemAtualUrl;

    // 1. Se o usuário selecionou uma nova imagem, faz o upload dela
    if (imagemFile) {
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

      const { data } = supabase.storage
        .from('produtos')
        .getPublicUrl(fileName);
        
      urlDaImagem = data.publicUrl;
    }

    const precoFormatado = parseFloat(preco.replace(",", "."));

    if (editingId) {
      // ATUALIZAR PRODUTO EXISTENTE
      const { error } = await supabase
        .from("produtos")
        .update({
          nome,
          descricao,
          preco: precoFormatado,
          imagem_url: urlDaImagem,
        })
        .eq("id", editingId);

      if (error) {
        alert("Erro ao atualizar produto: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchProdutos();
      }
    } else {
      // CRIAR NOVO PRODUTO
      const { error } = await supabase.from("produtos").insert([
        {
          nome,
          descricao,
          preco: precoFormatado,
          imagem_url: urlDaImagem,
        },
      ]);

      if (error) {
        alert("Erro ao salvar produto: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchProdutos();
      }
    }

    setLoading(false);
  };

  // Função para excluir o produto
  const handleDeleteProduct = async (id: string, imagemUrl: string) => {
    if (!confirm("Tem certeza de que deseja excluir esta peça?")) return;

    if (imagemUrl) {
      try {
        const partesUrl = imagemUrl.split('/');
        const nomeArquivo = partesUrl[partesUrl.length - 1];
        
        await supabase.storage
          .from('produtos')
          .remove([nomeArquivo]);
      } catch (err) {
        console.error("Erro ao remover imagem do storage:", err);
      }
    }

    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir produto: " + error.message);
    } else {
      fetchProdutos();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-stone-900 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel Administrativo - Crochê da Fran</h1>
        <button
          onClick={handleOpenNewModal}
          className="bg-stone-200 hover:bg-white text-stone-900 px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Adicionar Produto
        </button>
      </div>

      <div className="bg-stone-800 rounded-lg shadow-sm border border-stone-700 overflow-hidden">
        {produtos.length === 0 ? (
          <p className="p-6 text-stone-300 text-center">Nenhum produto cadastrado ainda.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-900 border-b border-stone-700">
                <th className="p-4 font-semibold text-stone-200">Foto</th>
                <th className="p-4 font-semibold text-stone-200">Nome da Peça</th>
                <th className="p-4 font-semibold text-stone-200">Preço</th>
                <th className="p-4 font-semibold text-stone-200">Status</th>
                <th className="p-4 font-semibold text-stone-200 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-b border-stone-700 hover:bg-stone-700/50">
                  <td className="p-4">
                    {produto.imagem_url ? (
                      <img src={produto.imagem_url} alt={produto.nome} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <span className="text-xs text-stone-500">Sem foto</span>
                    )}
                  </td>
                  <td className="p-4 text-white font-medium">{produto.nome}</td>
                  <td className="p-4 text-stone-300">R$ {produto.preco}</td>
                  <td className="p-4">
                    <span className="bg-green-900 text-green-100 text-xs px-2.5 py-1 rounded-full border border-green-700">
                      Em estoque
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(produto)}
                      className="bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-blue-500/30"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(produto.id, produto.imagem_url)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-red-500/30"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-stone-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? "Editar Peça" : "Nova Peça"}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-500 hover:text-stone-800 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nome da peça</label>
                <input
                  required
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none text-black bg-white"
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
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none text-black bg-white"
                  placeholder="Ex: 150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Foto da Peça</label>
                {imagemAtualUrl && !imagemFile && (
                  <div className="mb-2 flex items-center gap-2 text-xs text-stone-500">
                    <img src={imagemAtualUrl} alt="Atual" className="w-8 h-8 object-cover rounded" />
                    <span>Usando foto atual (selecione outra abaixo se quiser alterar)</span>
                  </div>
                )}
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
                  className="w-full border border-stone-300 rounded-md p-2 focus:ring-2 focus:ring-stone-500 outline-none text-black bg-white"
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
                  {loading ? "Salvando..." : editingId ? "Salvar Alterações" : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}