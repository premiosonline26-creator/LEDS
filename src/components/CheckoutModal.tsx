import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, CreditCard, QrCode, 
  CheckCircle2, Copy, Check, ArrowRight, Truck, ExternalLink 
} from 'lucide-react';
import { ProductVariant, getCheckoutUrl } from '../data/product';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: ProductVariant;
  quantity: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  variant,
  quantity,
}) => {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState('1');

  if (!isOpen) return null;

  const baseTotal = variant.totalPrice * quantity;
  const finalTotal = paymentMethod === 'pix' ? baseTotal * 0.95 : baseTotal;
  const pixDiscount = baseTotal * 0.05;

  const officialCheckoutUrl = getCheckoutUrl(variant);

  const handleCepLookup = async (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const d = await res.json();
        if (!d.erro) {
          setAddress(d.logradouro || '');
          setCity(d.localidade || '');
          setState(d.uf || '');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 900);
  };

  const copyPixCode = () => {
    const dummyPix = '00020126580014br.gov.bcb.pix0136d892348a-6b87-4321-9988-1a2b3c4d5e6f520400005303986540' + finalTotal.toFixed(2) + '5802BR5910CASANIVRA6009SAOPAULO62070503***6304';
    navigator.clipboard.writeText(dummyPix);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#FAFAFA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 font-['Sora'] leading-tight">
                CHECKOUT SEGURO • NATAL ESPECIAL
              </h2>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                Ambiente Criptografado SSL 256 bits
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'checkout' ? (
          <form onSubmit={handlePay} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Order summary box */}
            <div className="p-4 bg-[#F8F9FB] border border-gray-200/80 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://casanivra.com.br/cdn/shop/files/painel-led-natal-01_288x.jpg?v=1791585691" 
                  alt="Painel LED Natal"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-white"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 font-['Sora']">
                    Painel de LED de Natal para Sacada
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Kit Selecionado: <strong>{variant.name}</strong> ({quantity}x)
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1">
                    <Truck className="w-3 h-3" /> Frete Grátis Incluso
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-gray-900 font-['Sora']">
                  R$ {baseTotal.toFixed(2).replace('.', ',')}
                </div>
                {variant.compareAtPrice && (
                  <div className="text-[11px] text-gray-400 line-through">
                    R$ {(variant.compareAtPrice * quantity).toFixed(2).replace('.', ',')}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Official Link Banner for maximum convenience */}
            <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg flex items-center justify-between text-xs text-amber-900">
              <span className="text-[11px] font-medium">
                Deseja ir diretamente para o checkout seguro?
              </span>
              <a 
                href={officialCheckoutUrl} 
                className="font-bold underline text-amber-800 hover:text-black flex items-center gap-1 shrink-0 text-[11px]"
              >
                Abrir Checkout <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Customer identification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-['Sora'] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Nome Completo *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">CPF *</label>
                  <input
                    required
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">E-mail *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">WhatsApp / Telefone *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-['Sora'] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Endereço de Entrega
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">CEP *</label>
                  <input
                    required
                    type="text"
                    value={cep}
                    onChange={(e) => {
                      setCep(e.target.value);
                      handleCepLookup(e.target.value);
                    }}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1] font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Rua / Avenida *</label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua das Flores"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Número *</label>
                  <input
                    required
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Estado</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="UF"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1] uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Payment method selection */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-['Sora'] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1F4FD1] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Forma de Pagamento
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3.5 border-2 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-gray-900">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      PIX
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      -5% OFF
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Aprovação em segundos
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3.5 border-2 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#1F4FD1] bg-blue-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-gray-900">
                      <CreditCard className="w-4 h-4 text-[#1F4FD1]" />
                      Cartão de Crédito
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Em até 12x
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Nome impresso no Cartão</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="NOME COMO NO CARTÃO"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1] uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Validade</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Parcelamento</label>
                    <select
                      value={installmentsCount}
                      onChange={(e) => setInstallmentsCount(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F4FD1]"
                    >
                      <option value="1">1x de R$ {baseTotal.toFixed(2).replace('.', ',')} (sem juros)</option>
                      <option value="2">2x de R$ {(baseTotal * 0.5382).toFixed(2).replace('.', ',')}</option>
                      <option value="3">3x de R$ {(baseTotal * 0.3641).toFixed(2).replace('.', ',')}</option>
                      <option value="6">6x de R$ {(baseTotal * 0.1894).toFixed(2).replace('.', ',')}</option>
                      <option value="12">12x de R$ {(baseTotal * 0.1013).toFixed(2).replace('.', ',')}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Total calculation */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Total a pagar:</span>
                {paymentMethod === 'pix' && (
                  <span className="text-[11px] text-emerald-600 font-bold">
                    Economia de R$ {pixDiscount.toFixed(2).replace('.', ',')} no Pix
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-gray-900 font-['Sora']">
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#1F4FD1] hover:bg-[#183FA8] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <span>PROCESSANDO PEDIDO...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>FINALIZAR PEDIDO COM SEGURANÇA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Pedido Gerado com Sucesso!
              </span>
              <h3 className="text-xl font-black text-gray-900 font-['Sora'] mt-2">
                Obrigado, {name || 'Cliente'}!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Número do pedido: <strong>#CN-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </p>
            </div>

            {paymentMethod === 'pix' ? (
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Pague via Pix Copia e Cola:</span>
                  <span className="text-emerald-700 font-black">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-center py-2 bg-white rounded-xl border border-emerald-100">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=00020126580014br.gov.bcb.pix0136d892348a-casanivra-painel-led-natal`}
                    alt="QR Code Pix"
                    className="w-36 h-36"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value="00020126580014br.gov.bcb.pix0136d892348a-casanivra-painel-led-natal"
                    className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs font-mono text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={copyPixCode}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedPix ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <p className="text-[11px] text-emerald-800 text-center">
                  Após o pagamento, a confirmação e o código de rastreio serão enviados para o seu WhatsApp/E-mail.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 max-w-md mx-auto">
                <p className="font-bold">Pagamento em processamento pela operadora do cartão.</p>
                <p className="mt-1 text-gray-600">Você receberá os dados de envio em instantes no e-mail informado.</p>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={onClose}
                className="py-3 px-8 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Concluir e Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
