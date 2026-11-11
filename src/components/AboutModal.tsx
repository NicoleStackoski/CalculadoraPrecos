import React from 'react';
import { X, Info, Calculator, Percent, ShieldCheck } from 'lucide-react';
import { CIRCULAR_METADATA } from '../data/tabelaFinanceira';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#801b2a] text-white">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Sobre a Calculadora de Preços</h3>
              <p className="text-xs text-slate-300">Diretrizes Comerciais Mohawk Brasil / Eliane</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Deflação Financeira */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Calculator className="w-4 h-4 text-[#801b2a]" />
              <h4>1. Deflação e Conversão de Prazo de Pagamento</h4>
            </div>
            <p className="text-slate-600">
              Esta ferramenta realiza a equalização financeira de preços conforme a{' '}
              <strong>Circular Normativa nº {CIRCULAR_METADATA.number}</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Deflação para Valor À Vista:</strong> O valor de tabela é dividido pelo fator
                financeiro do prazo original da tabela (por exemplo, fator 1,0211 para 42 dias), obtendo-se o preço à vista.
              </li>
              <li>
                <strong>Aplicação do Prazo Desejado:</strong> O valor à vista é multiplicado pelo fator
                do prazo solicitado pelo cliente (por exemplo, 1,0282 para 56 dias).
              </li>
              <li>
                <strong>Descontos Sucessivos em Cascata (opcional):</strong> Quando aplicados, incidem sucessivamente
                sobre o preço de tabela antes da equalização de prazo.
              </li>
            </ol>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Conversão de ICMS */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Percent className="w-4 h-4 text-[#801b2a]" />
              <h4>2. Conversão de Percentual de ICMS</h4>
            </div>
            <p className="text-slate-600">
              Utilizada na equalização interestadual ou mudanças de regime tributário, mantendo
              a margem líquida e o valor do produto sem imposto:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-center text-xs text-slate-800">
              Preço Novo = [ Preço Atual × (1 − ICMS Atual) ] ÷ (1 − ICMS Desejado)
            </div>
            <p className="text-slate-500 text-xs">
              Garante que o valor líquido (receita líquida da empresa descontado o ICMS)
              permaneça inalterado ao alterar a alíquota tributária.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Normativa */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dados Normativos Oficiais</span>
            </div>
            <p><strong>Taxa diária de juros:</strong> 0,0496%</p>
            <p><strong>Taxa mensal de juros:</strong> 1,50%</p>
            <p><strong>Circular:</strong> nº {CIRCULAR_METADATA.number} (Data: {CIRCULAR_METADATA.date})</p>
            <p><strong>Emissão:</strong> {CIRCULAR_METADATA.issuer}</p>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#801b2a] text-white rounded-lg text-xs font-bold hover:bg-[#991b2e] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
