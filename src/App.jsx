import { useState } from 'react';

export default function App() {
  const [targetAngle, setTargetAngle] = useState(90);
  const [guessAngle, setGuessAngle] = useState(90);
  const [isRevealed, setIsRevealed] = useState(false);
  const [conceptLeft, setConceptLeft] = useState('Fácil de Achar');
  const [conceptRight, setConceptRight] = useState('Difícil de Achar');

  const shuffleTarget = () => {
    const newAngle = Math.floor(Math.random() * 181);
    setTargetAngle(newAngle);
    setIsRevealed(false);
  };

  const handleWheelClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height; 
    
    const dx = x - centerX;
    const dy = centerY - y; 

    const angleRad = Math.atan2(dy, dx);
    let angleDeg = angleRad * (180 / Math.PI);
    let finalAngle = 180 - angleDeg;
    
    if (finalAngle < 0) finalAngle = 0;
    if (finalAngle > 180) finalAngle = 180;

    setGuessAngle(finalAngle);
  };

  // Lógica de Pontuação
  const diff = Math.min(
    Math.abs(guessAngle - targetAngle),
    Math.abs(guessAngle - (targetAngle + 180)),
    Math.abs(guessAngle - (targetAngle - 180))
  );

  let scoreProps = { pts: 0, cls: 'bg-[#1a1a2e] text-[#4a4060] border-[#2a2540]', msg: '💨 PASSOU LONGE. 0 Pontos' };
  if (diff <= 5) scoreProps = { pts: 4, cls: 'bg-[#0a0d2d] text-blue-300 border-blue-900 shadow-[0_0_20px_rgba(147,197,253,0.15)]', msg: '🎯 NA MOSCA! +4 Pontos' };
  else if (diff <= 15) scoreProps = { pts: 3, cls: 'bg-[#2d0a0a] text-red-400 border-red-900', msg: '🔥 MUITO PERTO! +3 Pontos' };
  else if (diff <= 30) scoreProps = { pts: 2, cls: 'bg-[#2d2200] text-yellow-400 border-yellow-900', msg: '✨ QUASE LÁ! +2 Pontos' };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-[#1a1040] to-[#0a0a0f] text-[#f0ede8] font-sans p-8 pt-16">
      
      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[10px] mb-1 text-transparent bg-clip-text bg-white" style={{ textShadow: '0 0 40px rgba(167,139,250,0.4)' }}>
        Sintonia
      </h1>
      <h2 className="text-xs tracking-[3px] text-[#4a4060] uppercase mb-10">Wavelength</h2>

      {/* Espectro */}
      <div className="flex items-center gap-3 w-full max-w-[540px] mb-8">
        <input 
          value={conceptLeft} onChange={(e) => setConceptLeft(e.target.value)}
          className="flex-1 bg-[#13111e] border border-[#2a2540] rounded-lg text-center p-3 text-sm font-semibold outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-900/50 transition-all"
        />
        <span className="text-[10px] tracking-[2px] text-[#3d3560] uppercase whitespace-nowrap">← espectro →</span>
        <input 
          value={conceptRight} onChange={(e) => setConceptRight(e.target.value)}
          className="flex-1 bg-[#13111e] border border-[#2a2540] rounded-lg text-center p-3 text-sm font-semibold outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-900/50 transition-all"
        />
      </div>

      {/* Roleta */}
      <div 
        className="relative w-[min(520px,90vw)] h-[calc(min(520px,90vw)/2)] overflow-hidden cursor-crosshair rounded-t-full shadow-[0_0_60px_rgba(124,58,237,0.25)] ring-2 ring-white/5 bg-[#13111e]"
        onClick={handleWheelClick}
      >
        {/* Fatias Coloridas */}
        <div 
          className="absolute top-0 left-0 w-full aspect-square rounded-full transition-transform duration-500 ease-out"
          style={{
            // Adicionei o scale(0.99) aqui para recuar a borda
            transform: `rotate(${targetAngle}deg) scale(0.99)`, 
            background: `conic-gradient(
              #0f0d1a 0deg 60deg,
              #fbbf24 60deg 75deg, #f87171 75deg 85deg, #93c5fd 85deg 95deg, #f87171 95deg 105deg, #fbbf24 105deg 120deg,
              #0f0d1a 120deg 240deg,
              #fbbf24 240deg 255deg, #f87171 255deg 265deg, #93c5fd 265deg 275deg, #f87171 275deg 285deg, #fbbf24 285deg 300deg,
              #0f0d1a 300deg 360deg
            )`
          }}
        />

        {/* Cobertura */}
        <div 
          className={`absolute top-0 left-0 w-full aspect-square rounded-full flex justify-center pt-8 transition-opacity duration-400 z-20 pointer-events-none
            ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            // O scale(1.01) garante que a cobertura seja maior que o disco
            transform: 'scale(1.01)',
            background: 'conic-gradient(#13111e 0deg 55deg, #1d1a30 55deg 125deg, #13111e 125deg 235deg, #1d1a30 235deg 305deg, #13111e 305deg 360deg)' 
          }}
        >
          {/* Conteúdo do Alvo Oculto */}
          <span className="text-xs tracking-[4px] text-[#3d3560] uppercase bg-[#0a0a0f] border border-[#2a2540] rounded-full px-5 py-2 h-fit">
            Alvo Oculto
          </span>
        </div>

        {/* Ponteiro */}
        <div 
          className="absolute bottom-0 left-1/2 w-1.5 h-[88%] origin-bottom z-30 pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-50%) rotate(${guessAngle - 90}deg)` }}
        >
          <div className="w-full h-full bg-gradient-to-t from-white to-purple-200 rounded-t-md shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#f0ede8] border-4 border-[#0a0a0f] rounded-full shadow-[0_0_16px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Base da roleta (linha decorativa) */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] z-40 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 pointer-events-none" />
      </div>

      {/* Pontuação */}
      <div className="h-14 mt-8 flex items-center justify-center">
        {isRevealed ? (
          <div className={`px-8 py-2 rounded-full border font-extrabold text-lg tracking-wide transition-all ${scoreProps.cls}`}>
            {scoreProps.msg}
          </div>
        ) : (
          <div className="px-8 py-2 rounded-full border border-[#1d1a30] bg-[#13111e] text-[#4a4060] text-sm">
            Posicione o ponteiro e revele a faixa
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        <button 
          onClick={shuffleTarget}
          className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-[0_4px_20px_rgba(124,58,237,0.3)] active:scale-95 transition-all text-sm"
        >
          ↺ Embaralhar Faixa
        </button>
        <button 
          onClick={() => setIsRevealed(true)} disabled={isRevealed}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-[0_4px_20px_rgba(5,150,105,0.3)] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-sm"
        >
          Revelar Faixa
        </button>
        <button 
          onClick={() => setIsRevealed(false)} disabled={!isRevealed}
          className="px-6 py-2.5 bg-[#13111e] hover:bg-[#1d1a30] border border-[#2a2540] text-purple-300 font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-sm"
        >
          Ocultar
        </button>
      </div>

    </div>
  );
}