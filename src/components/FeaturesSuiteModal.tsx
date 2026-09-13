import React, { useState } from 'react';
import { ALL_236_FEATURES } from '../services/featuresList';
import { sound } from '../services/sound';
import { X, Search, CheckCircle2 } from 'lucide-react';

interface FeaturesSuiteModalProps {
  onClose: () => void;
}

export const FeaturesSuiteModal: React.FC<FeaturesSuiteModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');

  const filteredFeatures = ALL_236_FEATURES.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.mechanism.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.benefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toString().includes(searchTerm);

    const matchesModule = selectedModule === 'all' || f.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#030d05] border border-[#00FF66] rounded-xl w-full max-w-5xl h-[88vh] flex flex-col font-mono text-[#00FF66] shadow-[0_0_30px_rgba(0,255,102,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#00FF66]/20 flex items-center justify-between bg-black/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00FF66] text-black text-xs font-bold">
                236 / 236 ACTIVE
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Maki Full Capability Suite Inspector
              </h2>
            </div>
            <p className="text-xs text-[#00FF66]/70 mt-0.5">
              Verified Zero-Knowledge, Local-First, Sovereign Cypherpunk Specification
            </p>
          </div>

          <button
            onClick={() => {
              sound.playKeyClick('blue');
              onClose();
            }}
            className="p-1.5 rounded-lg border border-[#00FF66]/30 text-[#00FF66] hover:bg-[#00FF66]/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-black/40 border-b border-[#00FF66]/15 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#00FF66]/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 236 features..."
              className="w-full pl-9 pr-3 py-1.5 bg-black/70 border border-[#00FF66]/30 rounded text-xs text-[#00FF66] focus:outline-none focus:border-[#00FF66]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
            <button
              onClick={() => {
                sound.playKeyClick('brown');
                setSelectedModule('all');
              }}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all ${
                selectedModule === 'all'
                  ? 'bg-[#00FF66] text-black font-bold'
                  : 'bg-black/60 text-[#00FF66]/70 border border-[#00FF66]/20 hover:bg-[#00FF66]/10'
              }`}
            >
              All Modules
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((m) => (
              <button
                key={m}
                onClick={() => {
                  sound.playKeyClick('brown');
                  setSelectedModule(m);
                }}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all ${
                  selectedModule === m
                    ? 'bg-[#00FF66] text-black font-bold'
                    : 'bg-black/60 text-[#00FF66]/70 border border-[#00FF66]/20 hover:bg-[#00FF66]/10'
                }`}
              >
                M0{m}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Features List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-3 rounded-lg bg-black/60 border border-[#00FF66]/15 hover:border-[#00FF66]/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-[11px] font-bold shrink-0">
                  #{feat.id}
                </span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{feat.name}</span>
                    <span className="text-[10px] text-[#00FF66]/60 font-normal">
                      [M0{feat.module}: {feat.moduleName}]
                    </span>
                  </div>
                  <div className="text-[11px] text-[#00FF66]/70 mt-0.5">
                    <span className="text-white/80">{feat.mechanism}</span> — <span className="text-emerald-400">{feat.benefit}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{feat.status}</span>
                </span>
              </div>
            </div>
          ))}

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12 text-[#00FF66]/50 text-xs">
              No features matched the query "{searchTerm}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/50 border-t border-[#00FF66]/20 flex items-center justify-between text-xs text-[#00FF66]/70">
          <span>SHOWING {filteredFeatures.length} / 236 CAPABILITIES</span>
          <span>100MB BASE SHELL COMPLIANT</span>
        </div>
      </div>
    </div>
  );
};
