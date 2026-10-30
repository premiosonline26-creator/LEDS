/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, 
  ChevronRight, ChevronLeft, Check, Sparkles, Smartphone, 
  Music, Sliders, Palette, Zap, ArrowRight, Lock, 
  CheckCircle2, AlertCircle, Maximize2, X
} from 'lucide-react';
import { 
  PRODUCT_VARIANTS, 
  GALLERY_IMAGES, 
  VIDEO_CARDS, 
  FAQS, 
  REVIEWS, 
  ProductVariant,
  getCheckoutUrl
} from './data/product';
import { InstallmentModal } from './components/InstallmentModal';
import { ShippingCalculator } from './components/ShippingCalculator';
import { CheckoutModal } from './components/CheckoutModal';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function App() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(PRODUCT_VARIANTS[1]); // Default: 2 Unidades (Mais vendido)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // Helper to fire Meta Pixel checkout events
  const trackCheckoutPixel = () => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_name: 'Painel de LED de Natal para Sacada',
          content_ids: [selectedVariant.id],
          value: selectedVariant.totalPrice * quantity,
          currency: 'BRL',
        });
        window.fbq('track', 'InitiateCheckout', {
          content_name: 'Painel de LED de Natal para Sacada',
          content_ids: [selectedVariant.id],
          value: selectedVariant.totalPrice * quantity,
          currency: 'BRL',
        });
      }
    } catch (e) {
      console.warn('Pixel tracking error:', e);
    }
  };

  // Track ViewContent on load and variant change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_name: 'Painel de LED de Natal para Sacada',
          content_category: 'Iluminação de Natal',
          content_ids: [selectedVariant.id],
          value: selectedVariant.totalPrice * quantity,
          currency: 'BRL',
        });
      }
    } catch (e) {
      console.warn('Pixel tracking error:', e);
    }
  }, [selectedVariant, quantity]);

  // Monitor scroll to show bottom sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const bottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(bottom < 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHeroBuy = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCheckout = () => {
    trackCheckoutPixel();
    const checkoutUrl = getCheckoutUrl(selectedVariant);
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  // Prices calculation
  const currentTotalPrice = selectedVariant.totalPrice * quantity;
  const currentPixPrice = (currentTotalPrice * 0.95).toFixed(2).replace('.', ',');
  const currentInstallmentPrice = (currentTotalPrice * 0.1013).toFixed(2).replace('.', ',');

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col font-sans selection:bg-[#1F4FD1] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#EAE5DA] text-[#393D33] text-xs font-bold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 relative z-20 border-b border-[#dfd9cc]">
        <Truck className="w-3.5 h-3.5 text-[#1F4FD1] shrink-0" />
        <span>Frete grátis para todo Brasil • Edição Limitada de Natal 🎄</span>
      </div>

      {/* 2. HEADER: BRAND ONLY & DIRECT CHECKOUT BUTTON (NO LOGIN, NO OTHER DISTRACTING LINKS) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9E9E9] transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo with festive Santa Hat */}
          <div className="relative flex items-center cursor-pointer select-none" onClick={scrollToHeroBuy}>
            <div className="flex items-center gap-1 pl-2">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1A1A] font-['Sora'] flex items-center">
                NATAL<span className="text-[#1F4FD1] ml-1">ESPECIAL</span>
              </span>
            </div>
            <img 
              src="https://casanivra.com.br/cdn/shop/files/casa-nivra-chapeu-natal-20261020.webp?v=6934317270231807888" 
              alt="Gorro de Natal"
              className="absolute -top-3.5 -left-1.5 w-7 sm:w-8 h-auto pointer-events-none drop-shadow-xs"
            />
          </div>

          {/* Checkout Action Button */}
          <a
            href={getCheckoutUrl(selectedVariant)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackCheckoutPixel}
            className="flex items-center gap-2 py-2 px-3.5 sm:px-4 bg-[#1F4FD1] hover:bg-[#183FA8] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            aria-label="Finalizar Compra no Checkout"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {quantity}
              </span>
            </div>
            <span className="hidden sm:inline">Finalizar Compra / Checkout</span>
            <span className="sm:hidden">Checkout</span>
          </a>
        </div>
      </header>

      {/* 3. HERO SECTION (GALLERY & BUY BOX) */}
      <main className="flex-1">
        <div ref={heroRef} className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: INTERACTIVE GALLERY */}
            <div className="lg:col-span-7 space-y-3">
              {/* Main Image View */}
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#E9E9E9] bg-neutral-50 shadow-xs group">
                <img 
                  src={GALLERY_IMAGES[selectedImageIndex].src} 
                  alt={GALLERY_IMAGES[selectedImageIndex].alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Festive Tag */}
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Especial de Natal 2026
                </div>

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setLightboxImage(GALLERY_IMAGES[selectedImageIndex].src)}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                  title="Ampliar foto"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Prev / Next Arrows */}
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition-colors cursor-pointer"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition-colors cursor-pointer"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-5 gap-2.5">
                {GALLERY_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx 
                        ? 'border-[#1F4FD1] ring-2 ring-blue-500/30' 
                        : 'border-[#E9E9E9] hover:border-gray-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: BUY BOX & OPTIONS */}
            <div className="lg:col-span-5 space-y-5">
              {/* Product Header */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4FD1] bg-[#EAF0FD] px-2.5 py-1 rounded-full">
                  Natal Especial • Iluminação Inteligente
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-2 font-['Sora'] leading-tight">
                  Painel de LED de Natal para Sacada - OFERTA ESPECIAL
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">4.9</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 underline">187 avaliações verificadas</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E9E9E9]">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#1A1A1A] font-['Sora']">
                    R$ {currentTotalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  {selectedVariant.compareAtPrice && (
                    <span className="text-sm font-medium text-gray-400 line-through">
                      R$ {(selectedVariant.compareAtPrice * quantity).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  {selectedVariant.savings && (
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Economize R$ {(selectedVariant.savings * quantity).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                {/* Installment details */}
                <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span>ou <strong>12x de R$ {currentInstallmentPrice}</strong></span>
                  <span className="text-gray-300">•</span>
                  <span className="text-emerald-700 font-bold">R$ {currentPixPrice} no Pix (5% OFF)</span>
                </p>

                {/* Open installment modal trigger */}
                <button
                  type="button"
                  onClick={() => setIsInstallmentModalOpen(true)}
                  className="mt-2 text-xs font-bold text-[#1F4FD1] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Ver formas de pagamento & parcelamento <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* KIT SWATCH SELECTION (3 Options) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2 font-['Sora']">
                  Escolha o Kit Ideal para sua Sacada:
                </label>
                <div className="kit-swatch-list">
                  {PRODUCT_VARIANTS.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <div 
                        key={v.id} 
                        className={`kit-swatch ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedVariant(v)}
                      >
                        <div className="kit-swatch__item">
                          {v.badge && (
                            <span 
                              className="kit-swatch__badge" 
                              style={{ background: v.badgeBg, color: v.badgeColor }}
                            >
                              {v.badge}
                            </span>
                          )}
                          <span className="kit-swatch__label">{v.name}</span>
                          <span className="kit-swatch__meta">{v.meta}</span>
                          <div className="kit-swatch__prices">
                            {v.compareAtPrice && (
                              <s className="kit-swatch__compare">
                                R$ {v.compareAtPrice.toFixed(2).replace('.', ',')}
                              </s>
                            )}
                            <span className="kit-swatch__price">
                              R$ {v.totalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Buy Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#D5D5D5] rounded-xl bg-white px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:text-black cursor-pointer text-base"
                      aria-label="Diminuir quantidade"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-[#1A1A1A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:text-black cursor-pointer text-base"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Add to Cart / Checkout Button */}
                  <a
                    href={getCheckoutUrl(selectedVariant)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackCheckoutPixel}
                    className="flex-1 py-3.5 px-6 bg-[#1F4FD1] hover:bg-[#183FA8] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer font-['Sora'] text-center"
                  >
                    <Lock className="w-4 h-4" />
                    <span>ADICIONAR AO CARRINHO</span>
                  </a>
                </div>

                {/* Buy it now direct button */}
                <a
                  href={getCheckoutUrl(selectedVariant)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackCheckoutPixel}
                  className="w-full py-3.5 px-6 bg-[#1A1A1A] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer font-['Sora'] block text-center"
                >
                  COMPRAR AGORA COM FRETE GRÁTIS
                </a>
              </div>

              {/* Payment Methods Cards Box */}
              <div className="p-3 bg-white border border-[#E9E9E9] rounded-xl shadow-xs text-center space-y-2">
                <p className="text-[11px] font-bold text-[#565656] flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Formas de Pagamento
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/VISA.svg" alt="Visa" />
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/MASTERCARD.svg" alt="Mastercard" />
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/HIPERCARD.svg" alt="Hipercard" />
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/ELO.svg" alt="Elo" />
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/AMEX.svg" alt="Amex" />
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/DISCOVER.svg" alt="Discover" />
                  <img className="h-5 w-auto object-contain" src="https://casanivra.com.br/cdn/shop/t/10/assets/PIX.svg" alt="Pix" />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-[#FBFBFB] border border-[#E9E9E9] rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1F4FD1] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-[#1A1A1A]">Pagamentos e informações estão seguros</div>
                    <div className="text-gray-500 text-[11px]">Site oficial com criptografia SSL e proteção de dados</div>
                  </div>
                </div>

                <div className="p-3 bg-[#FBFBFB] border border-[#E9E9E9] rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-[#1A1A1A]">Frete Grátis para todo Brasil</div>
                    <div className="text-gray-500 text-[11px]">Envio rápido e seguro com código de rastreamento</div>
                  </div>
                </div>

                <div className="p-3 bg-[#FBFBFB] border border-[#E9E9E9] rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-[#1A1A1A]">Devoluções Gratuitas em 7 dias</div>
                    <div className="text-gray-500 text-[11px]">Estorno de 100% do seu dinheiro se você não amar</div>
                  </div>
                </div>
              </div>

              {/* Shipping Estimator */}
              <ShippingCalculator />
            </div>

          </div>
        </div>

        {/* 4. RICH LANDING PAGE CONTENT (.PL SECTIONS) */}
        <div className="pl">
          
          {/* SECTION 1: VEJA NA PRÁTICA */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Veja na prática</span>
              <h2>Escolha o desenho no celular e ele <span>aparece na sua sacada.</span></h2>
              <p>Papai Noel, trenzinho, boneco de neve e mensagens em LED na grade da sacada, visíveis da rua.</p>
            </div>

            {/* Video Cards with real MP4 loops */}
            <div className="pl-track">
              {VIDEO_CARDS.map((card, idx) => (
                <div key={idx} className="pl-vcard">
                  <div className="pl-vmedia">
                    <span className="pl-vtag">{card.tag}</span>
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="metadata" 
                      poster={card.poster}
                      aria-label={card.title}
                    >
                      <source src={card.videoSrc} type="video/mp4" />
                    </video>
                  </div>
                  <div className="pl-vbody">
                    <span className="pl-num">{card.step}</span>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Chips */}
            <div className="pl-chips">
              <span>
                <Check className="w-3.5 h-3.5" />
                Desenhos prontos
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Modo desenho
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Mensagens personalizadas
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Ritmo da música
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Aplicativo Bluetooth
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Controle remoto sem fio
              </span>
            </div>
          </section>

          {/* SECTION 2: O PROBLEMA DO PISCA-PISCA CONVENCIONAL */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">O problema</span>
              <h2>Da rua, a sacada com pisca-pisca <span>some no meio do prédio.</span></h2>
              <p>O pisca-pisca só pisca, não forma figura e fica o mês inteiro com o mesmo efeito. Para trocar, você precisa ir até o fio. O painel de LED forma desenhos de Natal na grade, e você troca o desenho pelo celular ou pelo controle remoto.</p>
            </div>

            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm mt-6">
              <img 
                src="https://casanivra.com.br/cdn/shop/files/painel-led-natal-problema-v2.webp?v=1791589812" 
                alt="Comparativo de sacada comum versus sacada com painel de LED"
                className="w-full h-auto object-cover"
              />
            </div>
          </section>

          {/* SECTION 3: DESTAQUES DO PRODUTO */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Destaques do produto</span>
              <h2>Desenhos de Natal na grade, <span>controlados pelo celular.</span></h2>
              <p>Liga no carregador USB e prende na grade sem furar a parede.</p>
            </div>

            <div className="pl-feat">
              <div>
                <div className="icon-wrap">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3>Desenhos prontos</h3>
                <p>Papai Noel, trenzinho, boneco de neve, árvore de Natal e flocos de neve em alta resolução.</p>
              </div>

              <div>
                <div className="icon-wrap">
                  <Palette className="w-6 h-6" />
                </div>
                <h3>Mensagens</h3>
                <p>Escreva "Feliz Natal", nomes da família ou recados especiais para quem passa na rua.</p>
              </div>

              <div>
                <div className="icon-wrap">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3>App e controle remoto</h3>
                <p>Desenho, cor e brilho pelo celular. Troca rápida de animações pelo controle.</p>
              </div>

              <div>
                <div className="icon-wrap">
                  <Zap className="w-6 h-6" />
                </div>
                <h3>USB 5 V</h3>
                <p>Liga diretamente num carregador de celular de tomada ou em qualquer fonte USB.</p>
              </div>
            </div>
          </section>

          {/* SECTION 4: COMO FUNCIONA */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Como funciona</span>
              <h2>Tudo o que o painel faz, <span>pelo app ou pelo controle.</span></h2>
              <p>LEDs RGB em rede inteligente, acesos um a um com tecnologia endereçável para formar o desenho perfeito.</p>
            </div>

            {/* Map image diagram */}
            <div className="max-w-xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-8">
              <img 
                src="https://casanivra.com.br/cdn/shop/files/painel-led-natal-mapa.webp?v=1791589812" 
                alt="Diagrama de funções do Painel de LED"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Features 6 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="flex items-center gap-2 text-sm font-extrabold text-gray-900 font-['Sora'] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Biblioteca de desenhos
                </b>
                <p className="text-xs text-gray-600">Dezenas de desenhos e animações de Natal prontos para usar com 1 clique.</p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="flex items-center gap-2 text-sm font-extrabold text-gray-900 font-['Sora'] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Modo desenho livre
                </b>
                <p className="text-xs text-gray-600">Pinte seu próprio desenho, ponto a ponto, na tela do seu celular.</p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="flex items-center gap-2 text-sm font-extrabold text-gray-900 font-['Sora'] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Mensagens em letreiro
                </b>
                <p className="text-xs text-gray-600">Escreva Feliz Natal, frases festivas e recados em movimento.</p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="flex items-center gap-2 text-sm font-extrabold text-gray-900 font-['Sora'] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                  Ritmo da música
                </b>
                <p className="text-xs text-gray-600">As luzes dançam e acompanham o som ambiente ou suas músicas preferidas.</p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="flex items-center gap-2 text-sm font-extrabold text-gray-900 font-['Sora'] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">5</span>
                  Brilho ajustável
                </b>
                <p className="text-xs text-gray-600">Do suave ao intenso, você escolhe a intensidade da luz pelo app.</p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="flex items-center gap-2 text-sm font-extrabold text-gray-900 font-['Sora'] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">6</span>
                  Controle remoto
                </b>
                <p className="text-xs text-gray-600">Troca rápida de desenhos e efeitos sem precisar abrir o aplicativo.</p>
              </div>
            </div>

            {/* Quick badges 4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <div className="border border-gray-200 rounded-xl p-3.5 bg-white text-center">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">2,5 a 4,3 m</b>
                <small className="block text-[11px] font-bold text-gray-500 uppercase mt-1">de grade por conjunto</small>
              </div>
              <div className="border border-gray-200 rounded-xl p-3.5 bg-white text-center">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">USB 5 V</b>
                <small className="block text-[11px] font-bold text-gray-500 uppercase mt-1">carregador de celular</small>
              </div>
              <div className="border border-gray-200 rounded-xl p-3.5 bg-white text-center">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">Sem furar</b>
                <small className="block text-[11px] font-bold text-gray-500 uppercase mt-1">clipes e abraçadeiras</small>
              </div>
              <div className="border border-gray-200 rounded-xl p-3.5 bg-white text-center">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">0 Mensalidade</b>
                <small className="block text-[11px] font-bold text-gray-500 uppercase mt-1">no aplicativo</small>
              </div>
            </div>
          </section>

          {/* SECTION 5: COMPARATIVO */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Comparativo</span>
              <h2>Pisca-pisca na grade × <span>Painel de LED</span></h2>
              <p>O que realmente muda na sua sacada neste fim de ano.</p>
            </div>

            <div className="pl-cmp">
              {/* Conventional Pisca-Pisca */}
              <div className="c">
                <h3>Pisca-pisca na grade</h3>
                <ul>
                  <li>
                    <span className="icon-badge text-gray-500">✕</span>
                    Da rua, a sacada some no meio do prédio
                  </li>
                  <li>
                    <span className="icon-badge text-gray-500">✕</span>
                    Só pisca, não forma nenhuma figura
                  </li>
                  <li>
                    <span className="icon-badge text-gray-500">✕</span>
                    O mesmo efeito repetitivo o mês inteiro
                  </li>
                  <li>
                    <span className="icon-badge text-gray-500">✕</span>
                    Fio embolado, torto e difícil de esticar
                  </li>
                  <li>
                    <span className="icon-badge text-gray-500">✕</span>
                    Para trocar o efeito, tem que ir até a tomada
                  </li>
                </ul>
              </div>

              {/* Smart LED Panel */}
              <div className="u">
                <h3>Painel de LED</h3>
                <ul>
                  <li>
                    <span className="icon-badge text-[#1F4FD1]">✓</span>
                    Desenhos de Natal nítidos e visíveis de longe
                  </li>
                  <li>
                    <span className="icon-badge text-[#1F4FD1]">✓</span>
                    Noel, trenzinho, boneco de neve e textos em LED
                  </li>
                  <li>
                    <span className="icon-badge text-[#1F4FD1]">✓</span>
                    Um desenho novo e dinâmico quando você quiser
                  </li>
                  <li>
                    <span className="icon-badge text-[#1F4FD1]">✓</span>
                    Rede perfeitamente esticada presa com clipes
                  </li>
                  <li>
                    <span className="icon-badge text-[#1F4FD1]">✓</span>
                    Troca na hora pelo celular ou pelo controle remoto
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <a 
              href={getCheckoutUrl(selectedVariant)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCheckoutPixel}
              className="pl-cta cursor-pointer block text-center"
            >
              Quero o painel na minha sacada
            </a>
            <p className="pl-ctasub">Escolha 1, 2 ou 3 unidades no topo da página ou finalize direto no checkout.</p>
          </section>

          {/* SECTION 6: ESPECIFICAÇÕES & O QUE VEM NA CAIXA */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Especificações</span>
              <h2>Medidas, ligação e <span>o que vem na caixa.</span></h2>
            </div>

            {/* Specs Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">2,5 a 4,3 m</b>
                <small className="block text-xs text-gray-600 mt-1">de grade por conjunto</small>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">LED RGB</b>
                <small className="block text-xs text-gray-600 mt-1">endereçável, um a um</small>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">USB 5 V</b>
                <small className="block text-xs text-gray-600 mt-1">carregador ou fonte USB</small>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">App + Controle</b>
                <small className="block text-xs text-gray-600 mt-1">desenho, cor e brilho</small>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">Sem furar</b>
                <small className="block text-xs text-gray-600 mt-1">clipes e abraçadeiras inclusos</small>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <b className="block text-xl font-black text-[#1F4FD1] font-['Sora']">Sacada coberta</b>
                <small className="block text-xs text-gray-600 mt-1">proteger fonte de chuva direta</small>
              </div>
            </div>

            {/* Box Contents */}
            <div className="mt-6 p-6 bg-white border border-gray-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 font-['Sora']">
                  Itens inclusos na embalagem:
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4FD1] shrink-0" />
                    <strong>1 painel de LED em rede de alta resistência</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4FD1] shrink-0" />
                    <strong>1 controle remoto multifuncional com bateria</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4FD1] shrink-0" />
                    <strong>Kit de clipes de fixação rápida para grade</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4FD1] shrink-0" />
                    <strong>1 cabo USB 5V de alimentação</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4FD1] shrink-0" />
                    <strong>Conjunto de abraçadeiras reforçadas</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F4FD1] shrink-0" />
                    <strong>Manual ilustrado em português com QR code do app</strong>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <img 
                  src="https://casanivra.com.br/cdn/shop/files/painel-led-natal-caixa.webp?v=1791589812" 
                  alt="Caixa do Painel de LED"
                  className="rounded-xl border border-gray-200 object-cover w-full h-full"
                />
                <img 
                  src="https://casanivra.com.br/cdn/shop/files/painel-led-natal-fecho.webp?v=1791589812" 
                  alt="Clipes de fixação sem furar"
                  className="rounded-xl border border-gray-200 object-cover w-full h-full"
                />
              </div>
            </div>
          </section>

          {/* SECTION 7: GARANTIA DE 7 DIAS */}
          <section>
            <div className="pl-guar">
              <ShieldCheck className="w-14 h-14 text-[#1F4FD1]" />
              <div>
                <h3>Não gostou? Devolva em 7 dias.</h3>
                <p>
                  Receba, prenda na grade e acenda o primeiro desenho. Se não for exatamente o que você esperava, devolva em até 7 dias sem precisar dar nenhuma explicação. Direito garantido pelo Código de Defesa do Consumidor, art. 49, com estorno integral e imediato.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 8: NESTE NATAL (FINAL CALL TO ACTION) */}
          <section className="text-center">
            <div className="pl-head">
              <span className="pl-eye">Neste Natal</span>
              <h2>Acenda a sacada e <span>deixe quem passa na rua parar para olhar.</span></h2>
            </div>

            <a 
              href={getCheckoutUrl(selectedVariant)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackCheckoutPixel}
              className="pl-cta cursor-pointer block text-center"
            >
              Quero o painel na minha sacada
            </a>

            {/* Seals */}
            <div className="pl-seals">
              <span>
                <Check className="w-3.5 h-3.5" />
                7 dias para devolver
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Sem furar a parede
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Liga no USB 5V
              </span>
              <span>
                <Check className="w-3.5 h-3.5" />
                Frete Grátis no checkout
              </span>
            </div>
          </section>

          {/* SECTION 9: PERGUNTAS FREQUENTES (FAQ) */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Tire suas dúvidas</span>
              <h2>Perguntas <span>frequentes</span></h2>
              <p>O que as pessoas mais perguntam antes de comprar o painel.</p>
            </div>

            <div className="pl-faq">
              {FAQS.map((faq, idx) => (
                <details key={idx} className="group cursor-pointer">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* SECTION 10: DEPOIMENTOS E AVALIAÇÕES */}
          <section>
            <div className="pl-head">
              <span className="pl-eye">Depoimentos reais</span>
              <h2>O que nossos clientes <span>estão dizendo</span></h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-base text-gray-900">4.9 de 5</span>
                <span className="text-xs text-gray-500">(187 avaliações de clientes satisfeitos)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {REVIEWS.map((review, idx) => (
                <div key={idx} className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-gray-900 font-['Sora'] flex items-center gap-1.5">
                        {review.name}
                        {review.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compra Verificada
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">{review.city} • {review.date}</div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 font-['Sora']">
                    "{review.title}"
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* 5. STICKY BOTTOM BUY BAR (Appears on scroll) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl py-2.5 px-4 animate-in slide-in-from-bottom duration-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src="https://casanivra.com.br/cdn/shop/files/painel-led-natal-01_165x.jpg?v=1791585691" 
                alt="Painel LED"
                className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate font-['Sora']">
                  Painel de LED de Natal para Sacada
                </h4>
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="font-black text-[#1F4FD1] text-sm font-['Sora']">
                    R$ {currentTotalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    ({selectedVariant.name})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getCheckoutUrl(selectedVariant)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackCheckoutPixel}
                className="py-2.5 px-5 bg-[#1F4FD1] hover:bg-[#183FA8] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer font-['Sora'] flex items-center gap-1.5 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>COMPRAR AGORA</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. FOOTER (NO LOGIN, NO OTHER DISTRACTING LINKS, ONLY BRANDING & SECURE CHECKOUT) */}
      <footer className="bg-[#1A1A1A] text-white py-10 px-4 mt-16 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-['Sora']">
              NATAL<span className="text-[#4E80FF] ml-1">ESPECIAL</span>
            </span>
          </div>

          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Iluminação Inteligente e Decoração de Natal para Sacadas e Varandas. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <img className="h-4 w-auto object-contain brightness-90" src="https://casanivra.com.br/cdn/shop/t/10/assets/VISA.svg" alt="Visa" />
            <img className="h-4 w-auto object-contain brightness-90" src="https://casanivra.com.br/cdn/shop/t/10/assets/MASTERCARD.svg" alt="Mastercard" />
            <img className="h-4 w-auto object-contain brightness-90" src="https://casanivra.com.br/cdn/shop/t/10/assets/HIPERCARD.svg" alt="Hipercard" />
            <img className="h-4 w-auto object-contain brightness-90" src="https://casanivra.com.br/cdn/shop/t/10/assets/ELO.svg" alt="Elo" />
            <img className="h-4 w-auto object-contain brightness-90" src="https://casanivra.com.br/cdn/shop/t/10/assets/AMEX.svg" alt="Amex" />
            <img className="h-4 w-auto object-contain brightness-90" src="https://casanivra.com.br/cdn/shop/t/10/assets/PIX.svg" alt="Pix" />
          </div>

          <div className="text-[11px] text-neutral-500 pt-4 border-t border-neutral-800">
            © {new Date().getFullYear()} Natal Especial • Compra 100% Segura com Certificado SSL 256 bits.
          </div>
        </div>
      </footer>

      {/* 7. MODALS */}
      <InstallmentModal
        isOpen={isInstallmentModalOpen}
        onClose={() => setIsInstallmentModalOpen(false)}
        price={currentTotalPrice}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        variant={selectedVariant}
        quantity={quantity}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Foto ampliada do Painel de LED" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
