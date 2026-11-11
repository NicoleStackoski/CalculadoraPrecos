import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Copy,
  Check,
} from 'lucide-react';
import { calculateIcmsConversion, COMMON_ICMS_RATES } from '../data/icmsCalculator';
import { formatCurrency, formatNumberBr } from '../utils/formatters';

interface ConversaoIcmsTabProps {
  onSaveToHistory?: (record: any) => void;
}

export const ConversaoIcmsTab: React.FC<ConversaoIcmsTabProps> = ({ onSaveToHistory }) => {
  const [currentPriceRaw, setCurrentPriceRaw] = useState<string>('100,00');
  const [currentIcmsRaw, setCurrentIcmsRaw] = useState<string>('18');
  const [targetIcmsRaw, setTargetIcmsRaw] = useState<string>('12');
  const [copied, setCopied] = useState(false);

  // Parse values
  const currentPrice = useMemo(() => {
    if (!currentPriceRaw) return 0;
    const clean = currentPriceRaw.replace(/[R$\s.]/g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }, [currentPriceRaw]);

  const currentIcms = useMemo(() => {
    const parsed = parseFloat(currentIcmsRaw.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  }, [currentIcmsRaw]);

  const targetIcms = useMemo(() => {
    const parsed = parseFloat(targetIcmsRaw.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  }, [targetIcmsRaw]);

  const result = useMemo(() => {
    return calculateIcmsConversion(currentPrice, currentIcms, targetIcms);
  }, [currentPrice, currentIcms, targetIcms]);

  const handleCopy = () => {
    const summary = `Cálculo de Conversão de ICMS:
Preço Atual: ${formatCurrency(result.currentPrice)} (ICMS: ${formatNumberBr(result.currentIcms)}%)
ICMS Desejado: ${formatNumberBr(result.targetIcms)}%
Preço Convertido: ${formatCurrency(result.targetPrice)}
Diferença: ${result.differenceValue >= 0 ? '+' : ''}${formatCurrency(result.differenceValue)} (${formatNumberBr(result.differencePercent)}%)
Base s/ ICMS: ${formatCurrency(result.netPriceWithoutTax)}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (onSaveToHistory) {
      onSaveToHistory({
        type: 'CONVERSAO_ICMS',
        title: `${formatCurrency(result.currentPrice)} (${result.currentIcms}% ➔ ${result.targetIcms}%)`,
        value: formatCurrency(result.targetPrice),
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        details: `Diferença: ${formatCurrency(result.differenceValue)} (${formatNumberBr(result.differencePercent)}%)`,
      });
    }
  };

  const formatRateLabel = (rate: number) => {
    return rate.toString().replace('.', ',') + '%';
  };

  return (
    <div className="w-full">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200/80">
          {/* Section 1: Preço atual do produto */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Preço atual do produto
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                VALOR ATUAL (R$)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentPriceRaw}
                  onChange={(e) => setCurrentPriceRaw(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#801b2a] focus:ring-2 focus:ring-[#801b2a]/20 rounded-lg px-4 py-3 text-slate-900 font-semibold text-lg transition-all outline-none tabular-nums"
                />
                {currentPrice > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPriceRaw('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Section 2: Percentual de ICMS atual */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Percentual de ICMS atual
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  ICMS ATUAL (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="99"
                    value={currentIcmsRaw}
                    onChange={(e) => setCurrentIcmsRaw(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#801b2a] focus:ring-2 focus:ring-[#801b2a]/20 rounded-lg px-4 py-3 text-slate-900 font-semibold text-base transition-all outline-none tabular-nums"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm select-none">
                    %
                  </span>
                </div>
              </div>

              {/* All Common ICMS pills for current ICMS */}
              <div>
                <span className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Selecione uma alíquota comum:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {COMMON_ICMS_RATES.map((item) => {
                    const isSelected = currentIcms === item.rate;
                    return (
                      <button
                        key={`atual-${item.rate}`}
                        type="button"
                        onClick={() => setCurrentIcmsRaw(item.rate.toString().replace('.', ','))}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#801b2a] text-white shadow-sm ring-1 ring-[#801b2a]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title={item.label}
                      >
                        {formatRateLabel(item.rate)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Section 3: Percentual de ICMS desejado */}
          <div>
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Percentual de ICMS desejado
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  ICMS DESEJADO (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="99"
                    value={targetIcmsRaw}
                    onChange={(e) => setTargetIcmsRaw(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#801b2a] focus:ring-2 focus:ring-[#801b2a]/20 rounded-lg px-4 py-3 text-slate-900 font-semibold text-base transition-all outline-none tabular-nums"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm select-none">
                    %
                  </span>
                </div>
              </div>

              {/* All Common ICMS pills for target ICMS */}
              <div>
                <span className="block text-[11px] text-slate-500 font-medium mb-1.5">
                  Selecione uma alíquota comum:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {COMMON_ICMS_RATES.map((item) => {
                    const isSelected = targetIcms === item.rate;
                    return (
                      <button
                        key={`desejado-${item.rate}`}
                        type="button"
                        onClick={() => setTargetIcmsRaw(item.rate.toString().replace('.', ','))}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#801b2a] text-white shadow-sm ring-1 ring-[#801b2a]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title={item.label}
                      >
                        {formatRateLabel(item.rate)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Result Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Dark Result Card */}
          <div className="bg-[#1f242d] text-white rounded-2xl p-6 shadow-xl border border-slate-700/60">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-5 h-5 text-slate-300" strokeWidth={1.25} />
                <h3 className="text-base font-bold text-white tracking-wide">Resultado</h3>
              </div>
              <button
                onClick={handleCopy}
                disabled={currentPrice <= 0}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Copiar resultado"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                    <span className="text-white">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.25} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* PREÇO CONVERTIDO */}
            <div className="py-5 border-b border-slate-700/70">
              <span className="block text-[11px] font-bold tracking-wider uppercase text-slate-300 mb-1">
                PREÇO CONVERTIDO
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums">
                {currentPrice > 0 ? formatCurrency(result.targetPrice) : 'R$ 0,00'}
              </div>
            </div>

            {/* DIFERENÇA (100% NA COR BRANCA, SEM OUTRA COR) */}
            <div className="py-4">
              <span className="block text-[11px] font-bold tracking-wider uppercase text-slate-300 mb-1">
                DIFERENÇA
              </span>
              <div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                  {currentPrice > 0 ? (
                    <span className="text-white">
                      {result.differenceValue > 0 ? '+' : ''}
                      {formatCurrency(result.differenceValue)} ({formatNumberBr(result.differencePercent)}%)
                    </span>
                  ) : (
                    <span className="text-white">R$ 0,00 (0,00%)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Subtitle / Resumo Tributário (Números em Branco) */}
            <div className="mt-1 pt-3 border-t border-slate-700/60 text-xs">
              {currentPrice <= 0 ? (
                <p className="text-slate-400">Preencha os campos para calcular.</p>
              ) : (
                <div className="bg-slate-900/60 rounded-lg p-3 text-slate-300 space-y-1.5">
                  <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Resumo tributário:
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Base sem ICMS (líquida):</span>
                    <span className="text-white font-medium">{formatCurrency(result.netPriceWithoutTax)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">ICMS na origem ({result.currentIcms}%):</span>
                    <span className="text-white">{formatCurrency(result.currentTaxValue)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">ICMS no destino ({result.targetIcms}%):</span>
                    <span className="text-white">{formatCurrency(result.targetTaxValue)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
