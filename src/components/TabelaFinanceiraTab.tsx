import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Table as TableIcon,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import {
  calculateTermConversion,
} from '../data/tabelaFinanceira';
import { formatCurrency, formatNumberBr, formatFactor } from '../utils/formatters';

interface TabelaFinanceiraTabProps {
  onOpenTableModal: () => void;
  onSaveToHistory?: (record: any) => void;
}

const PRESET_BASE_DAYS = [
  { label: 'à vista', days: 0 },
  { label: '14d', days: 14 },
  { label: '28d', days: 28 },
  { label: '42d', days: 42 },
  { label: '56d', days: 56 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
];

const PRESET_TARGET_DAYS = [
  { label: 'à vista', days: 0 },
  { label: '14d', days: 14 },
  { label: '28d', days: 28 },
  { label: '42d', days: 42 },
  { label: '56d', days: 56 },
  { label: '70d', days: 70 },
  { label: '84d', days: 84 },
  { label: '98d', days: 98 },
  { label: '112d', days: 112 },
];

export const TabelaFinanceiraTab: React.FC<TabelaFinanceiraTabProps> = ({
  onOpenTableModal,
  onSaveToHistory,
}) => {
  // State 1: Current Price (Valor atual)
  const [currentPriceRaw, setCurrentPriceRaw] = useState<string>('55,00');

  // State 2: Current average term (Prazo médio atual, max 120 days)
  const [baseDaysRaw, setBaseDaysRaw] = useState<string>('42');

  // State 3: Desired target term (Prazo desejado, max 120 days)
  const [targetDaysRaw, setTargetDaysRaw] = useState<string>('56');

  // Copy feedback
  const [copied, setCopied] = useState(false);

  // Parse values
  const currentPrice = useMemo(() => {
    if (!currentPriceRaw) return 0;
    const clean = currentPriceRaw.replace(/[R$\s.]/g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }, [currentPriceRaw]);

  // Base days strictly between 0 and 120
  const computedBaseDays = useMemo(() => {
    const raw = parseInt(baseDaysRaw, 10);
    if (isNaN(raw)) return 0;
    return Math.min(120, Math.max(0, raw));
  }, [baseDaysRaw]);

  // Desired target days strictly between 0 and 120
  const targetDays = useMemo(() => {
    const parsed = parseInt(targetDaysRaw, 10);
    if (isNaN(parsed)) return 0;
    return Math.min(120, Math.max(0, parsed));
  }, [targetDaysRaw]);

  // Main calculation (no discounts needed)
  const result = useMemo(() => {
    return calculateTermConversion(currentPrice, computedBaseDays, targetDays, []);
  }, [currentPrice, computedBaseDays, targetDays]);

  const handleBaseDaysChange = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 120) {
      setBaseDaysRaw('120');
    } else {
      setBaseDaysRaw(val);
    }
  };

  const handleTargetDaysChange = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 120) {
      setTargetDaysRaw('120');
    } else {
      setTargetDaysRaw(val);
    }
  };

  const handleCopy = () => {
    const summary = `Cálculo de Deflação de Preços:
Preço Atual: ${formatCurrency(result.originalPrice)}
Prazo Médio Atual: ${result.baseDays} dias (Fator: ${formatFactor(result.baseFactor)})
Valor À Vista: ${formatCurrency(result.cashPrice)}
Prazo Desejado: ${result.targetDays} dias (Fator: ${formatFactor(result.targetFactor)})
Preço Final no Prazo: ${formatCurrency(result.targetPrice)}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (onSaveToHistory) {
      onSaveToHistory({
        type: 'TABELA_FINANCEIRA',
        title: `${formatCurrency(result.originalPrice)} (${result.baseDays}d ➔ ${result.targetDays}d)`,
        value: formatCurrency(result.targetPrice),
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        details: `${formatCurrency(result.cashPrice)} à vista`,
      });
    }
  };

  return (
    <div className="w-full">
      {/* 2-Column Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200/80">
          {/* Section 1: Valor atual */}
          <div className="mb-7">
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Valor atual
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

          {/* Section 2: Prazo médio atual */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Prazo médio atual
              </h2>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Fator de Deflação: <span className="text-slate-900 font-bold">{formatFactor(result.baseFactor)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  PRAZO ATUAL (DIAS) <span className="text-slate-400 font-normal">(limite 120 dias)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={baseDaysRaw}
                  onChange={(e) => handleBaseDaysChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#801b2a] focus:ring-2 focus:ring-[#801b2a]/20 rounded-lg px-4 py-3 text-slate-900 font-semibold text-base transition-all outline-none tabular-nums"
                />
              </div>

              {/* Quick Base Term Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BASE_DAYS.map((preset) => {
                  const isSelected = computedBaseDays === preset.days;
                  return (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setBaseDaysRaw(preset.days.toString())}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[#801b2a] text-white shadow-sm ring-1 ring-[#801b2a]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Status pill */}
              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                <span className="text-slate-500">
                  Prazo base para deflacionamento:
                </span>
                <span className="font-semibold text-slate-800">
                  {computedBaseDays} dias · Fator {formatFactor(result.baseFactor)}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Section 3: Prazo desejado */}
          <div>
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Prazo desejado
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  PRAZO DESEJADO (DIAS) <span className="text-slate-400 font-normal">(limite 120 dias)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={targetDaysRaw}
                  onChange={(e) => handleTargetDaysChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#801b2a] focus:ring-2 focus:ring-[#801b2a]/20 rounded-lg px-4 py-3 text-slate-900 font-semibold text-lg transition-all outline-none tabular-nums"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_TARGET_DAYS.map((preset) => {
                  const isSelected = targetDays === preset.days;
                  return (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setTargetDaysRaw(preset.days.toString())}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[#801b2a] text-white shadow-sm ring-1 ring-[#801b2a]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Result Card (5 cols on lg) */}
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
                    <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.25} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Row 1: À VISTA ÷ FATOR BASE */}
            <div className="py-4 border-b border-slate-700/70">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
                  À VISTA ÷ FATOR BASE
                </span>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                  {currentPrice > 0 ? formatCurrency(result.cashPrice) : 'R$ 0,00'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Prazo original ({result.baseDays} dias)</span>
                <span>Fator: {formatFactor(result.baseFactor)}</span>
              </div>
            </div>

            {/* Row 2: NO PRAZO × FATOR ALVO */}
            <div className="py-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
                  NO PRAZO × FATOR ALVO
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">
                  {currentPrice > 0 ? formatCurrency(result.targetPrice) : 'R$ 0,00'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Prazo desejado ({result.targetDays} dias)</span>
                <span>Fator: {formatFactor(result.targetFactor)}</span>
              </div>
            </div>

            {/* Description / Mathematical Breakdown (All numbers purely in WHITE) */}
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs">
              {currentPrice <= 0 ? (
                <p className="text-slate-400">Preencha os campos para calcular.</p>
              ) : (
                <div className="bg-slate-900/60 rounded-lg p-3 text-slate-300 space-y-1.5">
                  <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Memória de cálculo:
                  </div>
                  <div className="text-xs leading-relaxed text-slate-200">
                    <span className="text-white font-medium">{formatCurrency(result.originalPrice)}</span>
                    {' ÷ '}
                    <span className="text-white font-medium">{formatFactor(result.baseFactor)}</span>
                    {' = '}
                    <span className="text-white font-semibold">{formatCurrency(result.cashPrice)}</span> (à vista)
                  </div>
                  <div className="text-xs leading-relaxed text-slate-200">
                    <span className="text-white font-medium">{formatCurrency(result.cashPrice)}</span>
                    {' × '}
                    <span className="text-white font-medium">{formatFactor(result.targetFactor)}</span>
                    {' = '}
                    <span className="text-white font-bold text-sm">{formatCurrency(result.targetPrice)}</span>
                  </div>
                  {result.differenceToOriginal !== 0 && (
                    <div className="text-[11px] pt-1 text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-300" strokeWidth={1.25} />
                      <span>
                        Diferença vs original:{' '}
                        <span className="text-white font-semibold">
                          {result.differenceToOriginal > 0 ? '+' : ''}
                          {formatCurrency(result.differenceToOriginal)} ({formatNumberBr(result.percentChangeToOriginal)}%)
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner: Tabela de fatores */}
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-md border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#801b2a]/10 text-[#801b2a] flex items-center justify-center shrink-0">
            <TableIcon className="w-5 h-5" strokeWidth={1.25} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Tabela de fatores</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Os fatores utilizados no cálculo são os da Circular Normativa nº 156.023 (1 a 120 dias).
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTableModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#801b2a] text-[#801b2a] hover:bg-[#801b2a] hover:text-white transition-all text-xs font-bold cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <span>Ver tabela completa</span>
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
};
