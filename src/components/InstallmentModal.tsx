import React, { useState } from 'react';
import { X, CreditCard, QrCode, FileText, CheckCircle2 } from 'lucide-react';

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
}

export const InstallmentModal: React.FC<InstallmentModalProps> = ({ isOpen, onClose, price }) => {
  const [activeTab, setActiveTab] = useState<'cartao' | 'pix' | 'boleto'>('cartao');

  if (!isOpen) return null;

  const pixPrice = (price * 0.95).toFixed(2).replace('.', ',');
  const formattedTotal = price.toFixed(2).replace('.', ',');

  // Calculate 12 installment rates (Shopify / gateway approximation as on Casanivra)
  const installments = [
    { times: 1, val: price.toFixed(2), total: price.toFixed(2) },
    { times: 2, val: (price * 0.5382).toFixed(2), total: (price * 1.0764).toFixed(2) },
    { times: 3, val: (price * 0.3641).toFixed(2), total: (price * 1.0923).toFixed(2) },
    { times: 4, val: (price * 0.2771).toFixed(2), total: (price * 1.1086).toFixed(2) },
    { times: 5, val: (price * 0.2246).toFixed(2), total: (price * 1.1231).toFixed(2) },
    { times: 6, val: (price * 0.1894).toFixed(2), total: (price * 1.1365).toFixed(2) },
    { times: 7, val: (price * 0.1639).toFixed(2), total: (price * 1.1472).toFixed(2) },
    { times: 8, val: (price * 0.1453).toFixed(2), total: (price * 1.1623).toFixed(2) },
    { times: 9, val: (price * 0.1307).toFixed(2), total: (price * 1.1769).toFixed(2) },
    { times: 10, val: (price * 0.1186).toFixed(2), total: (price * 1.1865).toFixed(2) },
    { times: 11, val: (price * 0.1092).toFixed(2), total: (price * 1.2012).toFixed(2) },
    { times: 12, val: (price * 0.1013).toFixed(2), total: (price * 1.2161).toFixed(2) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#FAFAFA]">
          <h3 className="text-base font-extrabold uppercase tracking-tight text-[#1A1A1A] font-['Sora']">
            Formas de Pagamento
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 p-1.5 bg-gray-100/80 mx-5 mt-4 rounded-xl text-xs font-bold text-gray-600">
          <button
            onClick={() => setActiveTab('cartao')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cartao' 
                ? 'bg-white text-[#1F4FD1] shadow-xs' 
                : 'hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cartão
          </button>
          <button
            onClick={() => setActiveTab('pix')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'pix' 
                ? 'bg-white text-emerald-600 shadow-xs' 
                : 'hover:text-gray-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Pix (-5%)
          </button>
          <button
            onClick={() => setActiveTab('boleto')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'boleto' 
                ? 'bg-white text-[#1A1A1A] shadow-xs' 
                : 'hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Boleto
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'cartao' && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
                <span>Parcelas no cartão de crédito:</span>
                <span className="font-semibold text-gray-700">Até 12x</span>
              </div>
              <ul className="divide-y divide-gray-100 text-xs">
                {installments.map((inst) => (
                  <li 
                    key={inst.times}
                    className={`flex items-center justify-between py-2.5 px-2.5 rounded-md ${
                      inst.times % 2 === 1 ? 'bg-gray-50/70' : 'bg-white'
                    }`}
                  >
                    <span className="font-semibold text-gray-900">
                      {inst.times}x de R$ {inst.val.replace('.', ',')}
                    </span>
                    <span className="text-gray-500 font-medium">
                      Total: R$ {inst.total.replace('.', ',')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'pix' && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mb-1">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-2">
                  5% de Desconto Imediato
                </span>
                <div className="text-3xl font-black text-emerald-600 font-['Sora']">
                  R$ {pixPrice}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  De <span className="line-through">R$ {formattedTotal}</span> à vista no Pix
                </p>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 text-left space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Aprovação em segundos
                </div>
                <p className="text-emerald-800/80">
                  O código Pix é gerado automaticamente na etapa de checkout. Seu pedido é enviado prioritariamente.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'boleto' && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-1">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 font-['Sora']">
                  R$ {formattedTotal}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pagamento à vista no Boleto Bancário
                </p>
              </div>
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 text-left space-y-1">
                <p className="font-semibold">Vencimento em até 3 dias úteis</p>
                <p className="text-blue-800/80">
                  Pode ser pago em qualquer agência bancária, lotérica ou pelo internet banking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
