import React from 'react';
import { X, History, Trash2, ArrowUpRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  type: 'TABELA_FINANCEIRA' | 'CONVERSAO_ICMS';
  title: string;
  value: string;
  details: string;
  date: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-slate-200">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-slate-300" />
            <h3 className="text-base font-bold">Histórico de Cálculos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-300" />
              <p>Nenhum cálculo copiado recentemente.</p>
              <p className="text-[11px] text-slate-400">
                Ao clicar em "Copiar" em qualquer cálculo, ele será salvo aqui automaticamente.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-slate-600">
                    {item.type === 'TABELA_FINANCEIRA' ? 'Tabela Financeira' : 'Conversão ICMS'}
                  </span>
                  <span>{item.date}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mb-1">{item.title}</div>
                <div className="text-base font-extrabold font-mono text-[#801b2a] mb-1">
                  {item.value}
                </div>
                <div className="text-xs text-slate-500">{item.details}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClear}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
