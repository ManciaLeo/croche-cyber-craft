'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Palette, 
  MessageCircle, 
  Heart, 
  Truck, 
  ShieldCheck, 
  ChevronDown,
  Tag,
  Zap,
  Menu
} from 'lucide-react';

const PALETTES = [
  { name: 'Clássico Crudo', primary: '#E5D3B3', secondary: '#8B5A2B' },
  { name: 'Romance Nude', primary: '#EED9D9', secondary: '#9D6B6B' },
  { name: 'Verde Sálvia', primary: '#C1CDBA', secondary: '#5A6B50' },
  { name: 'Terracota', primary: '#D27D5D', secondary: '#7A3E26' },
  { name: 'Azul Sereno', primary: '#BEE3F8', secondary: '#2B6CB0' },
  { name: 'Lavanda & Uva', primary: '#E9D8FD', secondary: '#6B46C1' },
  { name: 'Ouro & Girassol', primary: '#F6E05E', secondary: '#975A16' },
  { name: 'Jardim Colorido', primary: '#ED64A6', secondary: '#38B2AC' },
];

const PRONTA_ENTREGA = [
  { title: 'Tapete Oval Rosé', price: 'R$ 120,00', status: 'Única Peça', tag: 'Envio Imediato' },
  { title: 'Trilho de Mesa Dourado', price: 'R$ 180,00', status: 'Pronto para envio', tag: 'Envio Imediato' },
  { title: 'Kit Sousplat Cru (4 unid.)', price: 'R$ 150,00', status: 'Último kit', tag: 'Envio Imediato' },
];

const PRODUCTS = [
  { title: 'Trilhos de Mesa Luxo', category: 'Sala & Cozinha', desc: 'Tramas delicadas que valorizam qualquer mesa de jantar.' },
  { title: 'Jogos de Banheiro Complete', category: 'Banheiro', desc: 'Kits artesanais com alta durabilidade e encaixe perfeito.' },
  { title: 'Sousplats Personalizados', category: 'Mesa Posta', desc: 'Combinações de cores sob medida para recepcionar com estilo.' },
  { title: 'Croppeds & Moda Crochê', category: 'Vestuário', desc: 'Peças exclusivas feitas sob medida para o seu estilo.' },
];

const FAQS = [
  { q: 'Como faço para fazer um pedido sob medida?', a: 'Você pode escolher um modelo aqui no site ou enviar uma referência diretamente no WhatsApp da Fran. Definimos juntos as cores, medidas e prazo.' },
  { q: 'Qual é o prazo de entrega?', a: 'Como as peças são 100% produzidas à mão, o prazo varia de acordo com a complexidade do modelo e a fila de encomendas. O prazo exato é informado no orçamento.' },
  { q: 'Vocês enviam para todo o Brasil?', a: 'Sim! Enviamos para todos os estados via Correios (PAC ou Sedex) com código de rastreio.' },
];

const BANNER_IMAGES = [
  "/img/croche.png",
  "/img/croche2.png" 
];

export default function Home() {
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  const whatsappMsg = encodeURIComponent(
    `Olá Fran! Estive no seu site e adorei a combinação de cores "${selectedPalette.name}" para um jogo de crochê. Como posso encomendar?`
  );
  const whatsappUrl = `https://wa.me/5551989736603?text=${whatsappMsg}`;

  return (
    <main className="bg-[#FAFAFA] text-stone-800 min-h-screen selection:bg-[#B76E79]/30 selection:text-stone-900 font-sans">
      
      {/* --- HEADER / NAVEGAÇÃO --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
                src="/img/logofran.svg" 
                alt="Logo Fran Artes em Crochê" 
                className="h-12 w-auto" 
              />
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#pronta-entrega" className="hover:text-[#B76E79] transition-colors">Pronta Entrega</a>
            <a href="#simulador" className="hover:text-[#B76E79] transition-colors">Simulador</a>
            <a href="#galeria" className="hover:text-[#B76E79] transition-colors">Coleções</a>
          </nav>

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
          >
            Falar com a Fran
          </a>

          {/* Menu Mobile */}
          <button className="md:hidden text-stone-800">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden pt-20">
        
        {/* --- BANNER DE FUNDO (CARROSSEL FOTOGRÁFICO) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#FAFAFA]">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentSlide}
              src={BANNER_IMAGES[currentSlide]}
              alt="Fran Artes em Crochê" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent w-full md:w-3/4 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent z-10" />
        </div>

        {/* Glow Dourado e Rose Gold */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-10">
          <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200 via-[#B76E79]/40 to-transparent rounded-full blur-[100px]" />
        </div>

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl flex flex-col items-start text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 mb-8 text-stone-500 text-sm font-medium shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Arte Feita à Mão • Design Contemporâneo</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-stone-800"
            >
              O Crochê em Releitura <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 via-amber-500 to-[#B76E79]">
                Digital & Exclusiva
              </span>
            </motion.h1>

            <p className="mt-6 text-stone-600 text-lg md:text-xl font-light max-w-lg leading-relaxed">
              Transforme seus ambientes com a textura do aconchego e a precisão do design moderno. Peças sob medida direto da Fran para sua casa.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="#pronta-entrega"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium text-white bg-[#B76E79] hover:bg-[#a05a66] hover:scale-105 transition-all shadow-lg hover:shadow-[#B76E79]/40"
              >
                <Tag className="w-5 h-5" />
                <span>Ver Pronta Entrega</span>
              </a>
              <a 
                href="#simulador"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-stone-700 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-sm transition-all"
              >
                <Palette className="w-5 h-5 text-stone-400" />
                <span>Simulador de Cores</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DESTAQUES / PROVA SOCIAL RÁPIDA */}
      <section className="relative z-20 py-12 border-y border-stone-200 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-4">
            <div className="p-3 bg-white rounded-full shadow-sm border border-stone-100 mb-4">
              <Heart className="w-6 h-6 text-[#B76E79]" />
            </div>
            <h4 className="text-lg font-bold text-stone-800">100% Artesanal</h4>
            <p className="text-sm text-stone-500 mt-1">Cada ponto é confeccionado manualmente com carinho e precisão.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="p-3 bg-white rounded-full shadow-sm border border-stone-100 mb-4">
              <Truck className="w-6 h-6 text-amber-500" />
            </div>
            <h4 className="text-lg font-bold text-stone-800">Envio para Todo o Brasil</h4>
            <p className="text-sm text-stone-500 mt-1">Sua encomenda embalada com segurança até a sua porta.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="p-3 bg-white rounded-full shadow-sm border border-stone-100 mb-4">
              <ShieldCheck className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="text-lg font-bold text-stone-800">Atendimento Personalizado</h4>
            <p className="text-sm text-stone-500 mt-1">Escolha cores e tamanhos falando diretamente com a artesã.</p>
          </div>
        </div>
      </section>

      {/* 3. VITRINE PRONTA ENTREGA */}
      <section id="pronta-entrega" className="py-24 px-6 bg-[#B76E79]/5 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B76E79]/10 text-[#a05a66] text-xs font-mono uppercase tracking-widest mb-4">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Disponível Agora</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-stone-800">Pronta Entrega</h2>
              <p className="text-stone-500 mt-2">Peças exclusivas prontas para enviar hoje mesmo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRONTA_ENTREGA.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#B76E79]/20 shadow-sm hover:shadow-md transition-shadow relative">
                <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md z-10">
                  {item.tag}
                </span>
                
                <div className="w-full h-48 bg-stone-100 rounded-xl mb-6 flex items-center justify-center border border-stone-200/50 overflow-hidden">
                  <span className="text-stone-400 text-sm italic">Foto da peça aqui</span>
                </div>

                <h3 className="text-xl font-bold text-stone-800">{item.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold text-[#B76E79]">{item.price}</span>
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">{item.status}</span>
                </div>

                <a 
                  href={`https://wa.me/5551989736603?text=Olá!%20Tenho%20interesse%20na%20peça%20a%20pronta%20entrega:%20${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-[#B76E79] hover:bg-[#a05a66] transition-all shadow-md hover:shadow-[#B76E79]/40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Quero essa peça</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIMULADOR INTERATIVO */}
      <section id="simulador" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-mono uppercase tracking-widest mb-4">
              <Palette className="w-3.5 h-3.5" />
              <span>Simulador Interativo</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-stone-800">Visualize as Cores do Seu Pedido</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50">
            <div className="relative flex items-center justify-center min-h-[300px] rounded-2xl bg-stone-50 border border-stone-100 p-6 overflow-hidden">
              <div 
                className="absolute inset-0 blur-3xl transition-all duration-700 opacity-20" 
                style={{ backgroundColor: selectedPalette.primary }} 
              />
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-56 h-56 rounded-full border-8 border-dashed flex items-center justify-center transition-colors duration-500"
                style={{ borderColor: selectedPalette.primary }}
              >
                <div 
                  className="w-40 h-40 rounded-full border-4 flex items-center justify-center transition-colors duration-500 bg-white/50 backdrop-blur-sm"
                  style={{ borderColor: selectedPalette.secondary }}
                >
                  <div 
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-center p-2 transition-colors duration-500 shadow-inner"
                    style={{ backgroundColor: selectedPalette.secondary }}
                  >
                    <Sparkles className="w-5 h-5 text-white mb-1 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-white/90">
                      Fran Artes em Crochê
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-stone-800">
                  Paleta Selecionada: <span className="text-amber-600">{selectedPalette.name}</span>
                </h3>
                <p className="text-sm text-stone-500">Clique nas opções abaixo para testar:</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => setSelectedPalette(palette)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedPalette.name === palette.name
                        ? 'border-amber-400 bg-amber-50 shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex -space-x-2">
                      <span className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: palette.primary }} />
                      <span className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: palette.secondary }} />
                    </div>
                    <span className="text-xs font-medium text-stone-700">{palette.name}</span>
                  </button>
                ))}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Encomendar nesta Paleta</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOWROOM / LINHAS SOB ENCOMENDA */}
      <section id="galeria" className="py-24 px-6 max-w-6xl mx-auto bg-stone-50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-stone-800">Coleções sob Encomenda</h2>
          <p className="text-stone-500 mt-2">Escolha seu modelo favorito e personalize as cores.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.map((prod, idx) => (
            <div 
              key={idx}
              className="group relative p-8 rounded-3xl bg-white border border-stone-200 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-all" />
              <span className="text-xs font-mono text-amber-600 uppercase tracking-widest">{prod.category}</span>
              <h3 className="text-2xl font-bold mt-2 text-stone-800 group-hover:text-amber-700 transition-colors">{prod.title}</h3>
              <p className="text-stone-500 mt-3 text-sm leading-relaxed">{prod.desc}</p>
              
              <a 
                href={`https://wa.me/5551989736603?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(prod.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-500"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ (PERGUNTAS FREQUENTES) */}
      <section className="py-20 px-6 border-t border-stone-200 mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">Dúvidas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-medium text-stone-800 hover:bg-stone-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-amber-600' : 'text-stone-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-4 bg-stone-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 border-t border-stone-200 text-center text-xs text-stone-500 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <p className="font-bold text-stone-800 text-sm">Fran Artes em Crochê</p>
            <p className="mt-1">Arte manual com design contemporâneo.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* O Link do instagram dela permanece o mesmo, a não ser que ela tenha mudado o @ */}
            <a 
              href="https://www.instagram.com/crochedafran.oficial/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 hover:text-[#B76E79] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://wa.me/5551989736603" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 hover:text-green-600 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}