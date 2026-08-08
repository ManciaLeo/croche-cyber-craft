"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as htmlToImage from 'html-to-image';

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) alert("Erro ao excluir produto: " + error.message);
    else fetchProdutos();
  };

  // Lógica de Geração de Imagem para Story
  const handleShareStory = async (produto: any) => {
    const cardDiv = document.getElementById(`card-para-story-${produto.id}`);
    if (cardDiv) {
      try {
        const dataUrl = await htmlToImage.toBlob(cardDiv);
        if (dataUrl) {
          const file = new File([dataUrl], 'croche-fran-story.png', { type: 'image/png' });
          if (navigator.share) {
            await navigator.share({
              files: [file],
              title: produto.nome,
              text: `Confira essa peça da Crochê da Fran: ${produto.nome}`
            });
          } else {
            alert("Compartilhamento não suportado neste navegador.");
          }
        }
      } catch (err) {
        console.error("Erro ao gerar imagem:", err);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-stone-900 text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Painel Administrativo - Crochê da Fran</h1>
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
                <td className="p-4"><img src={produto.imagem_url} className="w-12 h-12 object-cover rounded" /></td>
                <td className="p-4">{produto.nome}</td>
                <td className="p-4">R$ {produto.preco}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleShareStory(produto)} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-xs font-bold">
                    📲 Story Insta
                  </button>
                  <button onClick={() => handleOpenEditModal(produto)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD INVISÍVEL PARA GERAÇÃO DA ARTE */}
      {produtos.map((produto) => (
        <div 
          key={`story-${produto.id}`} 
          id={`card-para-story-${produto.id}`}
          className="fixed -left-[9999px] top-0 w-[1080px] h-[1920px] bg-white flex flex-col items-center justify-center p-12"
        >
          <img src={produto.imagem_url} className="w-full h-[65%] object-cover rounded-[50px] shadow-2xl" />
          <div className="mt-16 text-center w-full">
            <h1 className="text-8xl font-bold text-stone-900">{produto.nome}</h1>
            <p className="text-6xl text-amber-700 font-black mt-8">R$ {produto.preco}</p>
            <div className="mt-20 bg-stone-900 text-white text-4xl py-8 px-16 rounded-full inline-block font-bold">
              Crochê da Fran
            </div>
          </div>
        </div>
      ))}

      {/* MODAL DE CADASTRO ... */}
      {/* (Mantém o mesmo formulário que você já tinha) */}
    </div>
  );
}