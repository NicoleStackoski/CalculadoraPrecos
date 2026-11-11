import React, { useState } from 'react';
import { X, Search, FileText, Check, Copy } from 'lucide-react';
import { LISTA_FATORES, CIRCULAR_METADATA } from '../data/tabelaFinanceira';
import { formatFactor } from '../utils/formatters';

interface TabelaCompletaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDays?: (days: number) => void;
}

export const TabelaCompletaModal: React.FC<TabelaCompletaModalProps> = ({
  isOpen,
  onClose,
  onSelectDays,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedDay, setCopiedDay] = useState<number | null>(null);

  if (!isOpen) return null;

  const filtered = LISTA_FATORES.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.days.toString().includes(term) ||
      item.factor.toString().includes(term) ||
      (item.tag && item.tag.toLowerCase().includes(term))
    );
  });

  // Group into 3 columns (1-40, 41-80, 81-120)
  const col1 = LISTA_FATORES.slice(0, 40);
  const col2 = LISTA_FATORES.slice(40, 80);
  const col3 = LISTA_FATORES.slice(80, 120);

  const handleCopyFactor = (days: number, factor: number) => {
    navigator.clipboard.writeText(`${formatFactor(factor)}`);
    setCopiedDay(days);
    setTimeout(() => setCopiedDay(null), 1500);
  };

  const renderRow = (item: (typeof LISTA_FATORES)[0]) => {
    const isCopied = copiedDay === item.days;

    return (
      <tr
        key={item.days}
        onClick={() => onSelectDays && onSelectDays(item.days)}
        className={`border-b border-slate-100 hover:bg-rose-50/50 transition-colors cursor-pointer group ${
          item.tag === 'IDEAL'
            ? 'bg-amber-50/80 font-bold'
            : item.tag === 'BOM'
            ? 'bg-emerald-50/80 font-bold'
            : item.tag === 'MÁXIMO'
            ? 'bg-rose-50/80 font-bold'
            : item.tag === 'ESPECIAL'
            ? 'bg-blue-50/80 font-bold'
            : ''
        }`}
      >
        <td className="py-1 px-2.5 text-xs text-slate-500 font-mono">
          {item.tag && (
            <span
              className={`inline-block text-[9px] font-bold px-1 py-0.2 rounded mr-1 ${
                item.tag === 'IDEAL'
                  ? 'bg-amber-200 text-amber-900'
                  : item.tag === 'BOM'
                  ? 'bg-emerald-200 text-emerald-900'
                  : item.tag === 'MÁXIMO'
                  ? 'bg-rose-200 text-rose-900'
                  : 'bg-blue-200 text-blue-900'
              }`}
            >
              {item.tag}
            </span>
          )}
          {item.days}
        </td>
        <td className="py-1 px-2.5 text-xs text-right font-mono font-semibold text-slate-900 tabular-nums">
          {formatFactor(item.factor)}
        </td>
        <td className="py-1 px-1 text-center w-8">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyFactor(item.days, item.factor);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copiar fator"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header: Gray tone matching site background instead of blue */}
        <div className="px-5 py-4 bg-[#34363d] text-white flex items-center justify-between border-b border-[#43464f]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#484a53] text-slate-200">
              <FileText className="w-5 h-5 text-white" strokeWidth={1.25} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
                Circular Normativa nº {CIRCULAR_METADATA.number}
              </h3>
              <p className="text-xs text-slate-300">
                Fator de Multiplicação para Cálculo de Preço de Venda em Real (1 a 120 dias)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.25} />
          </button>
        </div>

        {/* Toolbar & Search: Font color explicitly black for high contrast */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.25} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por dias ou fator..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-black font-semibold placeholder:text-slate-400 placeholder:font-normal outline-none focus:border-[#801b2a] focus:ring-1 focus:ring-[#801b2a]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-700">Taxas Oficiais:</span>
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-900 font-semibold">
              Diária: 0,0496%
            </span>
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-900 font-semibold">
              Mensal: 1,50%
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {searchTerm ? (
            /* Search Results in single responsive grid */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-2 px-3">Dias</th>
                    <th className="py-2 px-3 text-right">Fator</th>
                    <th className="py-2 px-3 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => renderRow(item))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        Nenhum prazo encontrado para "{searchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* 3 Columns Layout matching the original circular print sheet */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Coluna 1 (1 - 40) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 py-1.5 px-3 border-b border-slate-200 flex justify-between text-[11px] font-bold text-slate-700 uppercase">
                  <span>Dias</span>
                  <span>Fator</span>
                </div>
                <table className="w-full">
                  <tbody>{col1.map((item) => renderRow(item))}</tbody>
                </table>
              </div>

              {/* Coluna 2 (41 - 80) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 py-1.5 px-3 border-b border-slate-200 flex justify-between text-[11px] font-bold text-slate-700 uppercase">
                  <span>Dias</span>
                  <span>Fator</span>
                </div>
                <table className="w-full">
                  <tbody>{col2.map((item) => renderRow(item))}</tbody>
                </table>
              </div>

              {/* Coluna 3 (81 - 120) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 py-1.5 px-3 border-b border-slate-200 flex justify-between text-[11px] font-bold text-slate-700 uppercase">
                  <span>Dias</span>
                  <span>Fator</span>
                </div>
                <table className="w-full">
                  <tbody>{col3.map((item) => renderRow(item))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer info from circular */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            <span>Data: {CIRCULAR_METADATA.date}</span>
            <span className="mx-2">·</span>
            <span>Esta circular anula e substitui a anterior Circ. {CIRCULAR_METADATA.substitutes}</span>
          </div>
          <div className="font-semibold text-slate-700">
            {CIRCULAR_METADATA.company}
          </div>
        </div>
      </div>
    </div>
  );
};
