import React from 'react';
import { Cpu, ExternalLink } from 'lucide-react';
import { IICLogo, AcmNitkLogo, VidyutLogo, EngineerNitkLogo, ArcesiumLogo } from './BrandLogos';

export const Footer = () => {
  return (
    <footer className="border-t border-[#1f2125] bg-[#0c0d0e] py-12 px-4 mt-16 text-zinc-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
        
        {/* Col 1: Event Identity */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#181a1e] border border-[#2b2d34] flex items-center justify-center text-[#00e5ff]">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm tracking-widest font-mono">
              VERILOG QUEST '26
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Annual flagship RTL &times; FPGA Hardware Hackathon presented by <strong className="text-white">ACM NITK Vidyut</strong> &times; <strong className="text-amber-400">Engineer NITK '26</strong>, National Institute of Technology Karnataka, Surathkal.
          </p>
          <div className="text-[11px] font-mono text-[#00e5ff]">
            Prize Pool: ₹17,500 INR &bull; 25 Oct 2026
          </div>
        </div>

        {/* Col 2: Title Sponsor */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Title Sponsor
          </div>
          <div className="p-3.5 rounded-xl bg-[#131417] border border-[#222429] space-y-2.5">
            <div className="flex items-center justify-between">
              <ArcesiumLogo className="h-6" />
              <a
                href="https://www.arcesium.com"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Post-trade technology and data engineering systems for global institutional asset managers.
            </p>
          </div>
        </div>

        {/* Col 3: Institutional Organizers */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Host Organizations
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/assets/acm_nitk_logo.png" alt="ACM NITK" className="w-5 h-5 object-contain" />
              <span className="text-zinc-300 font-medium">ACM NITK Student Chapter</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/engi.png" alt="Engineer '26" className="w-5 h-5 object-contain rounded-sm" />
              <span className="text-amber-300 font-medium">Engineer '26 &bull; NITK Fest</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/vidyut_logo.png" alt="Vidyut SIG" className="w-5 h-5 object-contain" />
              <span className="text-zinc-300 font-medium">ACM Vidyut SIG</span>
            </div>
          </div>
        </div>

        {/* Col 4: Quick Portals */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Portals &amp; Venue
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://engineer.nitk.ac.in"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 hover:text-[#00e5ff] flex items-center gap-1.5 transition"
              >
                <span>engineer.nitk.ac.in</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </li>
            <li>
              <a
                href="https://acm.nitk.ac.in"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 hover:text-[#00e5ff] flex items-center gap-1.5 transition"
              >
                <span>acm.nitk.ac.in</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </li>
            <li className="text-zinc-500 text-[11px] pt-1">
              NITK Surathkal, Mangalore, Karnataka 575025
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#1e2025] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>&copy; 2026 ACM NITK Vidyut &bull; Engineer NITK '26 &bull; Sponsored by Arcesium.</p>
        <p className="flex items-center gap-1.5 font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Hardware Hackathon Portal
        </p>
      </div>
    </footer>
  );
};
