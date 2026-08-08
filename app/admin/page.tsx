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

  const handleOpenNewModal = () => {
    setEditingId(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setImagemFile(null);
    setImagemAtualUrl("");
    setIsModalOpen(true);
  };

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

  // Função para compartilhar o produto direto no Instagram/Redes Sociais
  const handleShareProduct = async (produto: any) => {
    const textoCompartilhamento = `✨ Peça disponível na Crochê da Fran!\n\n🧵 ${produto.nome}\n💰 R$ ${produto.preco}\n${produto.descricao ? `📝 ${produto.descricao}\n\n` : ''}📦 Envio para todo o Brasil! Fale conosco pelo site.`;

    // Se o navegador suportar compartilhamento nativo (excelente para celulares)
    if (navigator.share) {
      try {
        await navigator.share({
          title: produto.nome,
          text: textoCompartilhamento,
          url: window.location.origin, // Link do site
        });
      } catch (err) {
        console.log("Compartilhamento cancelado ou não suportado", err);
      }
    } else {
      // Se for no computador, copia o texto automaticamente para ela colar no Instagram Web / Facebook
      navigator.clipboard.writeText(textoCompartilhamento);
      alert("Legenda copiada para a área de transferência! Cole direto no Instagram ou Facebook. A foto pode ser salva clicando com o botão direito nela.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-stone-900 text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-sm text-stone-400">Crochê da Fran - Gestão de Vitrine</p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-md"
        >
          + Adicionar Produto
        </button>
      </div>

      <div className="bg-stone-800 rounded-xl shadow-lg border border-stone-700 overflow-hidden">
        {produtos.length === 0 ? (
          <p className="p-8 text-stone-400 text-center">Nenhum produto cadastrado na pronta entrega ainda.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-900 border-b border-stone-700 text-stone-400 text-xs uppercase tracking-wider">
                <th className="p-4">Foto</th>
                <th className="p-4">Nome da Peça</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações de Gestão</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-b border-stone-700/60 hover:bg-stone-700/30 transition-colors">
                  <td className="p-4">
                    {produto.imagem_url ? (
                      <img src={produto.imagem_url} alt={produto.nome} className="w-12 h-12 object-cover rounded-lg border border-stone-600" />
                    ) : (
                      <span className="text-xs text-stone-500 italic">Sem foto</span>
                    )}
                  </td>
                  <td className="p-4 text-white font-medium">{produto.nome}</td>
                  <td className="p-4 text-amber-400 font-semibold">R$ {produto.preco}</td>
                  <td className="p-4">
                    <span className="bg-green-900/60 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-700/50 font-medium">
                      Pronta Entrega
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleShareProduct(produto)}
                      className="bg-pink-600/20 hover:bg-pink-600 text-pink-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-pink-500/30 shadow-sm"
                      title="Compartilhar nos Stories / Redes Sociais"
                    >
                      📲 Divulgar
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(produto)}
                      className="bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-blue-500/30 shadow-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(produto.id, produto.imagem_url)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-500/30 shadow-sm"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-stone-900">
            <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
              <h2 className="text-xl font-bold text-stone-800">{editingId ? "Editar Peça" : "Nova Peça"}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-2xl leading-none"
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
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-black bg-stone-50"
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
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-black bg-stone-50"
                  placeholder="Ex: 150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Foto da Peça</label>
                {imagemAtualUrl && !imagemFile && (
                  <div className="mb-2 flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-200">
                    <img src={imagemAtualUrl} alt="Atual" className="w-10 h-10 object-cover rounded" />
                    <span>Usando foto atual cadastrada</span>
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
                  className="w-full border border-stone-300 rounded-lg p-2 text-stone-700 bg-stone-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-black bg-stone-50"
                  placeholder="Detalhes sobre a linha, tamanho..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors shadow-md"
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