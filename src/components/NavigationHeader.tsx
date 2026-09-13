import React from 'react';
import { ActiveModuleTab, ExecutionTier, HardwareProfile } from '../types';
import { sound } from '../services/sound';
import { 
  Cpu, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  Bot, 
  Flame, 
  Radio, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  Layers,
  Terminal,
  Zap,
  ShieldAlert
} from 'lucide-react';

interface NavigationHeaderProps {
  activeTab: ActiveModuleTab;
  setActiveTab: (tab: ActiveModuleTab) => void;
  hardware?: HardwareProfile | null;
  onPanicTrigger: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  ghostKeyFingerprint: string;
  onOpenFeaturesModal?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  setActiveTab,
  hardware,
  onPanicTrigger,
  soundEnabled,
  setSoundEnabled,
  ghostKeyFingerprint,
  onOpenFeaturesModal,
}) => {
  const tabs: { id: ActiveModuleTab; label: string; icon: React.ReactNode; num: string }[] = [
    { id: 'public-terminal', label: 'Public Terminal (AI & Sats)', icon: <Terminal className="w-3.5 h-3.5 text-[#00FF66]" />, num: 'PUBLIC' },
    { id: 'engine', label: 'Local NPU Engine', icon: <Cpu className="w-3.5 h-3.5" />, num: 'MOD 01' },
    { id: 'maki-uncensored', label: 'MAKI Sovereign (Uncensored)', icon: <Terminal className="w-3.5 h-3.5 text-[#00FF66]" />, num: 'CORE AI' },
    { id: 'satoshistream', label: 'SatoshiStream (Earn Sats)', icon: <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />, num: 'AD-TO-EARN' },
    { id: 'uncensored-models', label: 'Uncensored Models Hub', icon: <ShieldAlert className="w-3.5 h-3.5 text-[#00FF66]" />, num: 'AI MODELS' },
    { id: 'quantum-mesh', label: 'Quantum Mesh & P2P', icon: <Share2 className="w-3.5 h-3.5" />, num: 'MOD 02' },
    { id: 'zero-knowledge', label: 'Zero-Knowledge', icon: <ShieldCheck className="w-3.5 h-3.5" />, num: 'MOD 03' },
    { id: 'multimodal', label: 'Multimodal 3D / AR', icon: <Sparkles className="w-3.5 h-3.5" />, num: 'MOD 04' },
    { id: 'cypherpunk-btc', label: 'Cypherpunk Bitcoin', icon: <Coins className="w-3.5 h-3.5" />, num: 'MOD 05' },
    { id: 'agentic', label: 'Autonomous Agentic', icon: <Bot className="w-3.5 h-3.5" />, num: 'MOD 06' },
    { id: 'monetization', label: 'Compute Economy', icon: <Flame className="w-3.5 h-3.5" />, num: 'MOD 07' },
    { id: 'post-quantum', label: 'Post-Quantum & Covert', icon: <Radio className="w-3.5 h-3.5" />, num: 'MOD 08' },
    { id: 'feature-suite', label: '236 Feature Matrix', icon: <Layers className="w-3.5 h-3.5" />, num: 'ALL 236' },
  ];

  const handleTabClick = (tabId: ActiveModuleTab) => {
    sound.playKeyClick('blue');
    if (tabId === 'feature-suite' && onOpenFeaturesModal) {
      onOpenFeaturesModal();
    }
    setActiveTab(tabId);
  };

  return (
    <header className="border-b border-[#00FF66]/20 bg-[#020b04]/90 backdrop-blur sticky top-0 z-40">
      {/* Top Status Telemetry Bar */}
      <div className="px-3 py-1.5 border-b border-[#00FF66]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-[#00FF66] glow-green">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span className="tracking-widest">MAKI // ZERO-KNOWLEDGE P2P</span>
          </div>
          <span className="text-[#00FF66]/30">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#00FF66]">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping inline-block"></span>
            <span>HW: {hardware?.assignedTier || 'TIER_3'} ({hardware?.npuTops || 45} TOPS)</span>
          </div>
          <span className="hidden sm:inline text-[#00FF66]/30">|</span>
          <div className="hidden md:flex items-center gap-1 text-emerald-400">
            <span className="text-[#00FF66]">GHOST MESH:</span> 5/5 NODES [250 TOPS POOLED]
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-[#00FF66]/5 border border-[#00FF66]/20 rounded text-[10px]">
            <span className="text-[#00FF66]/60">TOR RELAY:</span>
            <span className="text-[#00FF66]">3-HOP .ONION</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-[#00FF66]/5 border border-[#00FF66]/20 rounded text-[10px]">
            <span className="text-[#00FF66]/60">SEED:</span>
            <span className="text-[#00FF66] font-mono">{ghostKeyFingerprint}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              sound.enabled = next;
              if (next) sound.playTerminalBeep(980, 0.08);
            }}
            title={soundEnabled ? 'Mute Mechanical Switch Audio' : 'Enable Mechanical Switch Audio'}
            className="p-1 rounded bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
          </button>

          {/* Emergency Panic Button */}
          <button
            id="btn-panic-calculator"
            onClick={() => {
              sound.playTerminalBeep(440, 0.1);
              onPanicTrigger();
            }}
            className="px-2 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/80 text-red-300 rounded flex items-center gap-1 text-[11px] font-bold transition-all shadow-sm active:scale-95"
            title="Panic Button: Instantly swaps app to functioning calculator decoy"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden xs:inline">PANIC (SWAP)</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <nav className="flex items-center overflow-x-auto no-scrollbar px-2 py-1 gap-1 border-t border-[#00FF66]/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#00FF66] text-black font-bold shadow-[0_0_10px_rgba(0,255,102,0.4)]'
                  : 'text-[#00FF66]/70 hover:text-[#00FF66] hover:bg-[#00FF66]/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded ${isActive ? 'bg-black/20 text-black' : 'text-[#00FF66]/40'}`}>
                {tab.num}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
