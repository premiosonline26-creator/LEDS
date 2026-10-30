import React, { useState } from 'react';
import { Truck, Check, Loader2, MapPin } from 'lucide-react';

export const ShippingCalculator: React.FC = () => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    city: string;
    uf: string;
    street?: string;
    neighborhood?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const formatCep = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 8);
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawCep = cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      setError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setError('CEP não encontrado. Verifique os números digitados.');
        setResult(null);
      } else {
        setResult({
          city: data.localidade,
          uf: data.uf,
          street: data.logradouro,
          neighborhood: data.bairro,
        });
      }
    } catch {
      // Fallback in case of CORS or network limits
      setResult({
        city: 'Brasil',
        uf: 'BR',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-3.5 bg-[#FBFBFB] border border-[#E9E9E9] rounded-xl text-xs">
      <div className="flex items-center gap-2 mb-2 font-bold text-[#1A1A1A]">
        <Truck className="w-4 h-4 text-[#1F4FD1]" />
        <span>Calcular frete e prazo de entrega</span>
      </div>

      <form onSubmit={handleCalculate} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            placeholder="00000-000"
            maxLength={9}
            className="w-full px-3 py-2 bg-white border border-[#D5D5D5] rounded-lg text-xs text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#1F4FD1] focus:ring-1 focus:ring-[#1F4FD1] transition-all font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading || cep.replace(/\D/g, '').length < 8}
          className="px-4 py-2 bg-[#1A1A1A] hover:bg-black disabled:bg-gray-300 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Calcular'}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-rose-600 font-medium">{error}</p>
      )}

      {result && (
        <div className="mt-2.5 p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-lg text-[#1A1A1A] space-y-1 animate-in fade-in">
          <div className="flex items-center justify-between font-bold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Frete Expresso Nacional:
            </span>
            <span className="uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-extrabold">
              GRÁTIS
            </span>
          </div>
          <div className="text-[11px] text-gray-600 flex items-center gap-1 pt-0.5">
            <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
            <span>
              Entrega em <strong>3 a 7 dias úteis</strong> para{' '}
              <strong className="text-gray-900">{result.city} - {result.uf}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
