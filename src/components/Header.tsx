import React from 'react';
import { Home } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="w-full relative z-30 pt-6 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Mohawk Brasil Official Logo */}
        <div
          className="flex items-center cursor-pointer select-none transition-transform hover:scale-[1.02]"
          onClick={onReset}
          title="Mohawk Brasil - Início"
        >
          <img
            src="/assets/aistudio/image_e4478075.png"
            alt="Mohawk Brasil"
            className="h-12 sm:h-16 md:h-20 w-auto max-w-[280px] object-contain drop-shadow-sm"
          />
        </div>

        {/* Central Title (Fine, elegant light letters as in the photo reference) */}
        <div className="text-center flex-1 px-4 hidden sm:block">
          <div className="inline-flex items-center gap-3">
            <span className="w-1 h-5 md:h-6 bg-[#b91c1c] rounded-full inline-block"></span>
            <h1 className="text-white text-lg md:text-2xl font-light tracking-[0.36em] uppercase">
              CALCULADORA DE PREÇOS
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-xs text-slate-300 tracking-[0.2em] font-light">
              Ferramentas para cálculos comerciais
            </p>
          </div>
        </div>

        {/* Right Action: Clean Home Button with delicate icon */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8b1529] cursor-pointer"
            title="Início / Limpar calculadora"
            aria-label="Início"
          >
            <Home className="w-5 h-5 text-slate-200" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Mobile Title with light lettering */}
      <div className="text-center mt-3 sm:hidden">
        <div className="inline-flex items-center gap-2">
          <span className="w-0.5 h-4 bg-[#b91c1c] rounded-full inline-block"></span>
          <h1 className="text-white text-sm font-light tracking-[0.26em] uppercase">
            CALCULADORA DE PREÇOS
          </h1>
        </div>
        <p className="text-[11px] text-slate-300 tracking-[0.14em] font-light mt-0.5">
          Ferramentas para cálculos comerciais
        </p>
      </div>
    </header>
  );
};
