import { useState } from 'react';

// Fases: 'master' → 'hidden' → 'guesser' → 'result'

export default function App() {
  const [phase, setPhase] = useState('master');
  const [targetAngle, setTargetAngle] = useState(90);
  const [guessAngle, setGuessAngle] = useState(90);
  const [conceptLeft, setConceptLeft] = useState('Fácil de Achar');
  const [conceptRight, setConceptRight] = useState('Difícil de Achar');
  const [clueName, setClueName] = useState('');

  const shuffleTarget = () => {
    const newAngle = Math.floor(Math.random() * 181);
    setTargetAngle(newAngle);
  };

  const handleWheelClick = (e) => {
    if (phase !== 'guesser') return;
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

  const resetGame = () => {
    setPhase('master');
    setTargetAngle(90);
    setGuessAngle(90);
    setClueName('');
  };

  // Lógica de Pontuação
  const diff = Math.min(
    Math.abs(guessAngle - targetAngle),
    Math.abs(guessAngle - (targetAngle + 180)),
    Math.abs(guessAngle - (targetAngle - 180))
  );

  let scoreProps = { pts: 0, cls: 'bg-[#1a1a2e] text-[#4a4060] border-[#2a2540]', msg: '💨 PASSOU LONGE. 0 Pontos' };
  if (diff <= 5)       scoreProps = { pts: 4, cls: 'bg-[#0a0d2d] text-blue-300 border-blue-900 shadow-[0_0_20px_rgba(147,197,253,0.15)]', msg: '🎯 NA MOSCA! +4 Pontos' };
  else if (diff <= 15) scoreProps = { pts: 3, cls: 'bg-[#2d0a0a] text-red-400 border-red-900', msg: '🔥 MUITO PERTO! +3 Pontos' };
  else if (diff <= 30) scoreProps = { pts: 2, cls: 'bg-[#2d2200] text-yellow-400 border-yellow-900', msg: '✨ QUASE LÁ! +2 Pontos' };

  const phaseConfig = {
    master: {
      badge: '👀 Vez do Mestre',
      badgeCls: 'bg-purple-900/40 text-purple-300 border border-purple-800/50',
      instruction: 'Embaralhe a faixa, veja onde o alvo está e escreva uma dica para o adivinhador.',
      showDisc: true,
      showNeedle: false,
      showCover: false,
    },
    hidden: {
      badge: '🔒 Passando para o Adivinhador',
      badgeCls: 'bg-slate-800/60 text-slate-400 border border-slate-700/50',
      instruction: 'Entregue o dispositivo para o adivinhador. A faixa está oculta.',
      showDisc: false,
      showNeedle: false,
      showCover: true,
    },
    guesser: {
      badge: '🤔 Vez do Adivinhador',
      badgeCls: 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50',
      instruction: 'Clique na roleta para posicionar o ponteiro onde você acha que está o alvo.',
      showDisc: false,
      showNeedle: true,
      showCover: true,
    },
    result: {
      badge: '🎯 Resultado',
      badgeCls: 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50',
      instruction: null,
      showDisc: true,
      showNeedle: true,
      showCover: false,
    },
  };

  const cfg = phaseConfig[phase];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-[#1a1040] to-[#0a0a0f] text-[#f0ede8] font-sans p-8 pt-12">

      {/* Título */}
      <h1
        className="text-4xl md:text-5xl font-extrabold uppercase tracking-[10px] mb-1 text-white"
        style={{ textShadow: '0 0 40px rgba(167,139,250,0.4)' }}
      >
        Sintonia
      </h1>
      <h2 className="text-xs tracking-[3px] text-[#4a4060] uppercase mb-8">Wavelength</h2>

      {/* Badge de fase */}
      <div className={`text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 ${cfg.badgeCls}`}>
        {cfg.badge}
      </div>

      {/* Instrução */}
      {cfg.instruction && (
        <p className="text-sm text-[#6b6490] text-center max-w-sm mb-6 leading-relaxed">
          {cfg.instruction}
        </p>
      )}

      {/* Espectro */}
      <div className="flex items-center gap-3 w-full max-w-[540px] mb-6">
        <input
          value={conceptLeft}
          onChange={(e) => setConceptLeft(e.target.value)}
          disabled={phase !== 'master'}
          className="flex-1 bg-[#13111e] border border-[#2a2540] rounded-lg text-center p-3 text-sm font-semibold outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-900/50 transition-all disabled:opacity-50 disabled:cursor-default"
        />
        <span className="text-[10px] tracking-[2px] text-[#3d3560] uppercase whitespace-nowrap">← espectro →</span>
        <input
          value={conceptRight}
          onChange={(e) => setConceptRight(e.target.value)}
          disabled={phase !== 'master'}
          className="flex-1 bg-[#13111e] border border-[#2a2540] rounded-lg text-center p-3 text-sm font-semibold outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-900/50 transition-all disabled:opacity-50 disabled:cursor-default"
        />
      </div>

      {/* Roleta */}
      <div
        className="relative w-[min(520px,90vw)] h-[calc(min(520px,90vw)/2)] overflow-hidden rounded-t-full shadow-[0_0_60px_rgba(124,58,237,0.25)] ring-2 ring-white/5 bg-[#13111e]"
        onClick={handleWheelClick}
        style={{ cursor: phase === 'guesser' ? 'crosshair' : 'default' }}
      >
        {/* Disco colorido */}
        {cfg.showDisc && (
          <div
            className="absolute top-0 left-0 w-full aspect-square rounded-full transition-transform duration-500 ease-out"
            style={{
              transform: `rotate(${targetAngle}deg) scale(0.99)`,
              background: `conic-gradient(
                #0f0d1a 0deg 60deg,
                #fbbf24 60deg 75deg, #f87171 75deg 85deg, #93c5fd 85deg 95deg, #f87171 95deg 105deg, #fbbf24 105deg 120deg,
                #0f0d1a 120deg 240deg,
                #fbbf24 240deg 255deg, #f87171 255deg 265deg, #93c5fd 265deg 275deg, #f87171 275deg 285deg, #fbbf24 285deg 300deg,
                #0f0d1a 300deg 360deg
              )`,
            }}
          />
        )}

        {/* Cobertura */}
        {cfg.showCover && (
          <div
            className="absolute top-0 left-0 w-full aspect-square rounded-full flex justify-center pt-8 z-20 pointer-events-none"
            style={{
              transform: 'scale(1.01)',
              background: 'conic-gradient(#13111e 0deg 55deg, #1d1a30 55deg 125deg, #13111e 125deg 235deg, #1d1a30 235deg 305deg, #13111e 305deg 360deg)',
            }}
          >
            <span className="text-xs tracking-[4px] text-[#3d3560] uppercase bg-[#0a0a0f] border border-[#2a2540] rounded-full px-5 py-2 h-fit">
              Alvo Oculto
            </span>
          </div>
        )}

        {/* Ponteiro */}
        {cfg.showNeedle && (
          <div
            className="absolute bottom-0 left-1/2 w-1.5 h-[88%] origin-bottom z-30 pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-50%) rotate(${guessAngle - 90}deg)` }}
          >
            <div className="w-full h-full bg-gradient-to-t from-white to-purple-200 rounded-t-md shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#f0ede8] border-4 border-[#0a0a0f] rounded-full shadow-[0_0_16px_rgba(255,255,255,0.4)]" />
          </div>
        )}

        {/* Linha base */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] z-40 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 pointer-events-none" />
      </div>

      {/* Campo de dica — só no master */}
      {phase === 'master' && (
        <div className="w-full max-w-[540px] mt-5">
          <label className="block text-xs tracking-[2px] text-[#3d3560] uppercase mb-2">
            Sua dica para o adivinhador
          </label>
          <input
            value={clueName}
            onChange={(e) => setClueName(e.target.value)}
            placeholder="Ex: Vulcão, Gelo, Música calma..."
            className="w-full bg-[#13111e] border border-[#2a2540] rounded-lg p-3 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-900/50 transition-all text-[#f0ede8] placeholder-[#3d3560]"
          />
        </div>
      )}

      {/* Dica visível para adivinhador e resultado */}
      {(phase === 'guesser' || phase === 'result') && clueName && (
        <div className="mt-5 text-center">
          <p className="text-xs tracking-[2px] text-[#3d3560] uppercase mb-1">Dica do mestre</p>
          <p className="text-2xl font-extrabold tracking-wide text-[#f0ede8]">"{clueName}"</p>
        </div>
      )}

      {/* Pontuação — só no resultado */}
      {phase === 'result' && (
        <div className={`mt-6 px-8 py-3 rounded-full border font-extrabold text-xl tracking-wide ${scoreProps.cls}`}>
          {scoreProps.msg}
        </div>
      )}

      {/* Botões por fase */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">

        {phase === 'master' && (
          <>
            <button
              onClick={shuffleTarget}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-[0_4px_20px_rgba(124,58,237,0.3)] active:scale-95 transition-all text-sm"
            >
              ↺ Embaralhar Faixa
            </button>
            <button
              onClick={() => setPhase('hidden')}
              disabled={!clueName.trim()}
              className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-sm"
            >
              🙈 Ocultar e Passar
            </button>
          </>
        )}

        {phase === 'hidden' && (
          <button
            onClick={() => setPhase('guesser')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-[0_4px_20px_rgba(5,150,105,0.3)] active:scale-95 transition-all text-sm"
          >
            ✅ Sou o Adivinhador — Mostrar
          </button>
        )}

        {phase === 'guesser' && (
          <button
            onClick={() => setPhase('result')}
            className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow-[0_4px_20px_rgba(202,138,4,0.3)] active:scale-95 transition-all text-sm"
          >
            🎯 Revelar Resultado
          </button>
        )}

        {phase === 'result' && (
          <button
            onClick={resetGame}
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-[0_4px_20px_rgba(124,58,237,0.3)] active:scale-95 transition-all text-sm"
          >
            ↺ Nova Rodada
          </button>
        )}

      </div>
    </div>
  );
}