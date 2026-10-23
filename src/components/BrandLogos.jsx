import React from 'react';
import { Zap } from 'lucide-react';

// Official ACM NITK Student Chapter Logo using /assets/ACM.png
// ACM.png is 1080x1080 with 790x272 of actual content centered (x: 135-925, y: 405-677).
// Aspect ratio is 790 / 272 = ~2.90.
// background-size: 133% auto with background-position: 46.3% 50.1% displays the ENTIRE logo
// (diamond emblem + divider + Association for Computing Machinery NITK Student Chapter)
// fully visible, crisp, centered, and unclipped.
export const AcmNitkLogo = ({ className = "", size = "normal" }) => {
  // Height 50px-55px matches Engineer emblem (50px-52px) with 1:1 optical parity
  // 790/272 = 2.90 aspect ratio
  const sizeClasses = {
    normal: "w-[145px] h-[50px] sm:w-[160px] sm:h-[55px]",
    compact: "w-[125px] h-[43px] sm:w-[136px] sm:h-[47px]",
    large: "w-[200px] h-[69px] sm:w-[240px] sm:h-[83px]",
  }[size] || size;

  return (
    <div 
      className={`inline-block select-none ${className}`}
      title="Association for Computing Machinery - NITK Student Chapter"
    >
      <div 
        className={`${sizeClasses} transition-transform hover:scale-[1.02]`}
        style={{
          backgroundImage: 'url(/assets/ACM.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '46.3% 50.1%',
          backgroundSize: '133% auto',
          filter: 'brightness(1.1) contrast(1.1)'
        }}
      />
    </div>
  );
};

// Iconic ACM Diamond Emblem (the circular ACM within a diamond)
// Diamond bounds: x: 135-399 (width 264), y: 412-675 (height 263).
export const AcmDiamondLogo = ({ className = "w-6 h-6" }) => (
  <div
    className={`inline-block select-none rounded bg-[#141518] border border-[#23252b] ${className}`}
    title="ACM - Association for Computing Machinery"
  >
    <div
      className="w-full h-full"
      style={{
        backgroundImage: 'url(/assets/ACM.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '16.4% 50.4%',
        backgroundSize: '390% auto',
        filter: 'brightness(1.15) contrast(1.1)'
      }}
    />
  </div>
);

// Official Arcesium Logo using /assets/arcesium.png
export const ArcesiumLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <img
      src="/assets/arcesium.png"
      alt="Arcesium"
      className="h-6 sm:h-7 w-auto object-contain brightness-105"
    />
  </div>
);

// Official Engineer '26 NITK Logo using /assets/engi.png and official "Chakra Petch" typography
export const EngineerNitkLogo = ({ className = "", size = "normal" }) => {
  const iconClasses = {
    normal: "h-[42px] w-[42px] sm:h-[48px] sm:w-[48px]",
    compact: "h-[32px] w-[32px] sm:h-[36px] sm:w-[36px]",
    large: "h-[54px] w-[54px] sm:h-[60px] sm:w-[60px]",
  }[size] || "h-[42px] w-[42px] sm:h-[48px] sm:w-[48px]";

  const textClasses = {
    normal: "text-base sm:text-lg tracking-wider",
    compact: "text-xs sm:text-sm tracking-wide",
    large: "text-xl sm:text-2xl tracking-widest",
  }[size] || "text-base sm:text-lg tracking-wider";

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <img
        src="/assets/engi.png"
        alt="Engineer '26"
        className={`${iconClasses} object-contain rounded drop-shadow`}
      />
      <span 
        className={`font-mecha font-black uppercase whitespace-nowrap leading-none ${textClasses}`}
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 15%, #E0F7FA 50%, #38BDF8 85%, #00E5FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.35))'
        }}
      >
        ENGINEER '26
      </span>
    </div>
  );
};

// ACM NITK Vidyut SIG Crest
export const VidyutLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <div className="w-7 h-7 rounded-lg bg-[#141518] border border-[#23252b] flex items-center justify-center text-[#00e5ff]">
      <Zap className="w-3.5 h-3.5 text-[#00e5ff]" />
    </div>
    <div className="text-left leading-tight hidden md:block">
      <span className="text-[11px] font-bold text-white tracking-wide block">VIDYUT</span>
      <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">ACM NITK</span>
    </div>
  </div>
);

// Official IIC Logo (Institution's Innovation Council)
export const IICLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-amber-300">
      IIC
    </div>
    <span className="text-[10px] font-semibold text-zinc-400 hidden sm:inline">
      MHRD IIC
    </span>
  </div>
);

