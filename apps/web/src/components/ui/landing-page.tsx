import React from "react"; 
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Component as CelestialOrrery } from "@/components/ui/celestial-orrery";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Background Security Orrery */}
      <div className="absolute inset-0 z-0 opacity-70">
        <CelestialOrrery />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-5xl px-6 flex flex-col items-center text-center">
        
        {/* Eyebrow / Tag */}
        <div className="mb-6 px-3 py-1 border border-[#333] bg-[#111] text-[#00E599] font-mono text-xs font-semibold tracking-wider uppercase rounded-sm">
          VibeGuard Security Scanner
        </div>

        <h1 className="font-bold mb-6 leading-[1.05] tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white">
          Understand Any <br />
          <span className="text-gray-400">Codebase Instantly.</span>
        </h1>
        
        <p className="text-[#A1A1AA] leading-relaxed mb-12 text-lg sm:text-xl font-medium tracking-tight max-w-2xl mx-auto">
          Next-gen AI-Powered DevSecOps Orchestrator with real-time risk scoring, deterministic scanners, and instant code remediation. 
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-16">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3.5 bg-[#00E599] hover:bg-[#00c985] text-black font-semibold tracking-tight transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00E599]/50"
          >
            Launch Dashboard
          </button>
          
          <button
            onClick={() => window.open('https://github.com/Maverickrd007/VibeGuard', '_blank')}
            className="px-8 py-3.5 bg-transparent border-2 border-[#333] text-[#FAFAFA] hover:border-[#666] font-semibold tracking-tight transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#666]/50"
          >
            View Documentation
          </button>
        </div>

        {/* Tech Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 w-full max-w-3xl pt-10 border-t border-[#222]">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="font-mono text-3xl font-bold text-[#FAFAFA] mb-1">
              3.2M<span className="text-[#00E599]">+</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-[#71717A] font-semibold">
              Lines Scanned / Sec
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="font-mono text-3xl font-bold text-[#FAFAFA] mb-1">
              0.8<span className="text-[#00E599]">s</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-[#71717A] font-semibold">
              Mean Time to Fix
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="font-mono text-3xl font-bold text-[#FAFAFA] mb-1">
              0<span className="text-[#00E599]">.0</span>
            </div>
            <div className="text-xs uppercase tracking-widest text-[#71717A] font-semibold">
              Zero-Day Exposure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
