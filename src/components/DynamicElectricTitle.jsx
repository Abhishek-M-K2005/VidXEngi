import React from 'react';

/**
 * DynamicElectricTitle
 * Cyber-mecha typography matching the official festival aesthetic (media_1792436257632_5905a179.png).
 * Clean, bold, and razor-sharp without extraneous canvas lightning or particle noise.
 */
export const DynamicElectricTitle = () => {
  return (
    <div className="relative inline-block select-none my-1 sm:my-2 transition-transform duration-300 hover:scale-[1.01]">
      <h1 
        className="font-mecha font-black uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight tracking-[0.04em] sm:tracking-[0.06em]"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 15%, #E6FCFF 45%, #67E8F9 78%, #00E5FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 24px rgba(0, 229, 255, 0.4)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9))',
        }}
      >
        VERILOG QUEST
      </h1>
    </div>
  );
};
