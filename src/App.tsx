import React, { useState } from 'react';
import { Header } from './components/Header';
import { TabelaFinanceiraTab } from './components/TabelaFinanceiraTab';
import { ConversaoIcmsTab } from './components/ConversaoIcmsTab';
import { TabelaCompletaModal } from './components/TabelaCompletaModal';
import { Table, Percent } from 'lucide-react';

type TabType = 'tabela' | 'icms';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tabela');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const handleResetAll = () => {
    setActiveTab('tabela');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-[#801b2a] selection:text-white relative overflow-x-hidden">
      {/* Charcoal-to-wine gradient matching the supplied background reference. */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(180deg, #414247 0%, #3b3c40 50%, #39383c 66%, #4a2d33 82%, #6b2731 100%)',
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col pb-6">
        {/* Top Header with Large Mohawk Logo */}
        <Header onReset={handleResetAll} />

        {/* Main Center Container */}
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-5">
          {/* Top Tabs Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Tab 1: Tabela Financeira */}
            <button
              type="button"
              onClick={() => setActiveTab('tabela')}
              className={`text-left p-4 sm:p-5 rounded-2xl transition-all cursor-pointer flex items-center gap-4 ${
                activeTab === 'tabela'
                  ? 'bg-white text-slate-900 shadow-xl border-2 border-[#801b2a]'
                  : 'bg-white/95 text-slate-700 hover:bg-white shadow-md border border-slate-200/80 opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`p-3 rounded-xl shrink-0 transition-colors ${
                  activeTab === 'tabela'
                    ? 'bg-[#801b2a]/10 text-[#801b2a]'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Table className="w-6 h-6" strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Deflação de preços
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Conversão de preços por prazo de pagamento
                </p>
              </div>
            </button>

            {/* Tab 2: Conversão de ICMS */}
            <button
              type="button"
              onClick={() => setActiveTab('icms')}
              className={`text-left p-4 sm:p-5 rounded-2xl transition-all cursor-pointer flex items-center gap-4 ${
                activeTab === 'icms'
                  ? 'bg-white text-slate-900 shadow-xl border-2 border-[#801b2a]'
                  : 'bg-white/95 text-slate-700 hover:bg-white shadow-md border border-slate-200/80 opacity-90 hover:opacity-100'
              }`}
            >
              <div
                className={`p-3 rounded-xl shrink-0 transition-colors ${
                  activeTab === 'icms'
                    ? 'bg-[#801b2a]/10 text-[#801b2a]'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Percent className="w-6 h-6" strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Conversão de ICMS
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Conversão de preços entre percentuais de ICMS
                </p>
              </div>
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'tabela' ? (
            <TabelaFinanceiraTab onOpenTableModal={() => setIsTableModalOpen(true)} />
          ) : (
            <ConversaoIcmsTab />
          )}
        </main>
      </div>

      {/* 
        Seamless Footer: No dark gray band, no border. 
        Brand logos float directly over the red/wine bottom gradient with increased size.
      */}
      <footer className="relative z-10 w-full pt-4 pb-10 bg-transparent flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 w-full flex justify-center">
          <img
            src="/assets/aistudio/image_fd53a17e.png"
            alt="Marcas do Grupo: Eliane, Decortiles, Elizabeth, Mohawk Brasil"
            className="h-14 sm:h-20 md:h-24 w-auto max-w-[95%] object-contain opacity-95 transition-transform hover:scale-[1.01]"
          />
        </div>
      </footer>

      {/* Circular Modal */}
      <TabelaCompletaModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
    </div>
  );
}
