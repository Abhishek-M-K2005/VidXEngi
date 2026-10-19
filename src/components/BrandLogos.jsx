import React from 'react';

// Official IIC Logo (Institution's Innovation Council)
export const IICLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <img
      src="/assets/iic_clean_poster.png"
      alt="Institution's Innovation Council"
      className="h-7 w-auto object-contain brightness-105"
    />
  </div>
);

// Official ACM NITK Student Chapter Logo with text
export const AcmNitkLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <img
      src="/assets/acm_clean_poster.png"
      alt="ACM NITK Student Chapter"
      className="h-7 w-auto object-contain brightness-105"
    />
  </div>
);

// ACM NITK Vidyut SIG Crest
export const VidyutLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <img
      src="/assets/vidyut_crest_clean.png"
      alt="ACM Vidyut"
      className="h-7 w-auto object-contain"
    />
    <div className="text-left leading-tight hidden md:block">
      <span className="text-[11px] font-bold text-white tracking-wide block">VIDYUT</span>
      <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">ACM NITK</span>
    </div>
  </div>
);

// Official Engineer '26 NITK Logo
export const EngineerNitkLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <img
      src="/assets/engi.png"
      alt="Engineer NITK '26"
      className="h-6 w-6 object-contain rounded"
    />
    <div className="text-left leading-tight hidden sm:block">
      <span className="text-xs font-black text-amber-400 tracking-wide block">ENGINEER</span>
      <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-mono">NITK '26</span>
    </div>
  </div>
);

// Official Arcesium Logo
export const ArcesiumLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2 select-none ${className}`}>
    <img
      src="/assets/arcesium_clean_poster.png"
      alt="Arcesium"
      className="h-7 w-auto object-contain brightness-105"
    />
  </div>
);
