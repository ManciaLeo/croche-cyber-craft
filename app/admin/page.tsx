"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as htmlToImage from 'html-to-image';

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [gerandoId, setGerandoId] = useState<string | null>(null); // Estado para controlar o botão de gerar story

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
        await supabase.storage.from('produtos').remove([nomeArquivo]);
      } catch (err) {
        console.error("Erro ao remover imagem:", err);
      }
    }

    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) alert("Erro ao excluir produto: " + error.message);
    else fetchProdutos();
  };

  // =========================================================================
  // NOVA LÓGICA DE GERAÇÃO PARA STORIES (BURLANDO O BLOQUEIO DOS CELULARES)
  // =========================================================================
  const handleShareStory = async (produto: any) => {
    setGerandoId(produto.id); // Muda o botão para "Gerando..."

    try {
      // 1. Baixa a imagem do Supabase e converte para Base64 (Isso impede o erro de tela preta e bloqueio de segurança CORS)
      const response = await fetch(produto.imagem_url);
      const blob = await response.blob();
      const base64Url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // 2. Coloca a imagem Base64 na tag invisível
      const imgElement = document.getElementById(`img-story-${produto.id}`) as HTMLImageElement;
      if (imgElement) {
        imgElement.src = base64Url;
      }

      // 3. Dá um tempinho (meio segundo) para o celular renderizar a imagem antes de tirar o print
      await new Promise((resolve) => setTimeout(resolve, 500));

      const cardDiv = document.getElementById(`card-para-story-${produto.id}`);
      if (cardDiv) {
        // 4. Tira o print do card
        const imageBlob = await htmlToImage.toBlob(cardDiv, {
          backgroundColor: '#ffffff',
          pixelRatio: 1, // Impede que o celular trave por falta de memória
        });
        
        if (imageBlob) {
          // 5. Prepara o arquivo final e manda pro Instagram
          const file = new File([imageBlob], 'croche-fran-story.png', { type: 'image/png' });
          if (navigator.share) {
            await navigator.share({
              files: [file],
              title: produto.nome,
              text: `✨ Novidade na Crochê da Fran: ${produto.nome}`
            });
          } else {
            alert("Compartilhamento automático não suportado neste aparelho.");
          }
        }
      }
    } catch (err) {
      console.error("Erro ao gerar arte:", err);
      alert("Ops! Houve um erro de conexão ao gerar a imagem. Tente novamente.");
    } finally {
      setGerandoId(null); // Volta o botão ao normal
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-stone-900 text-white font-sans overflow-x-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel Admin - Crochê da Fran</h1>
        <button onClick={handleOpenNewModal} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          + Adicionar Produto
        </button>
      </div>

      <div className="bg-stone-800 rounded-xl shadow-lg border border-stone-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-900 border-b border-stone-700 text-stone-400 text-xs uppercase">
              <th className="p-4">Foto</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Preço</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="border-b border-stone-700 hover:bg-stone-700/50">
                <td className="p-4">
                  {produto.imagem_url ? (
                    <img src={produto.imagem_url} className="w-12 h-12 object-cover rounded" alt={produto.nome} />
                  ) : (
                    <span className="text-xs text-stone-500 italic">Sem foto</span>
                  )}
                </td>
                <td className="p-4">{produto.nome}</td>
                <td className="p-4">R$ {produto.preco}</td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => handleShareStory(produto)} 
                    disabled={gerandoId === produto.id}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm ${
                      gerandoId === produto.id ? 'bg-stone-600 text-stone-300' : 'bg-pink-600 hover:bg-pink-700 text-white'
                    }`}
                  >
                    {gerandoId === produto.id ? '⏳ Gerando...' : '📲 Story Insta'}
                  </button>
                  <button onClick={() => handleOpenEditModal(produto)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteProduct(produto.id, produto.imagem_url)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ARMAZÉM INVISÍVEL DOS CARDS (BEM LONGE DA TELA PARA NÃO ATRAPALHAR O LAYOUT) */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        {produtos.map((produto) => (
          <div 
            key={`story-${produto.id}`} 
            id={`card-para-story-${produto.id}`}
            className="w-[1080px] h-[1920px] bg-white flex flex-col items-center justify-center p-12"
          >
            {/* A imagem começa sem nada, e é preenchida pelo Base64 na hora de clicar */}
            <img 
              id={`img-story-${produto.id}`}
              className="w-full h-[65%] object-cover rounded-[50px] shadow-2xl" 
              alt="Produto para Story"
            />
            <div className="mt-16 text-center w-full">
              <h1 className="text-8xl font-bold text-stone-900">{produto.nome}</h1>
              <p className="text-6xl text-amber-700 font-black mt-8">R$ {produto.preco}</p>
              <div className="mt-20 bg-stone-900 text-white text-4xl py-8 px-16 rounded-full inline-block font-bold">
                Crochê da Fran
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
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