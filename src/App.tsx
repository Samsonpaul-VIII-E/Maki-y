import React, { useState, useEffect } from 'react';
import { HardwareProfile, GenerationSettings, ActiveModuleTab } from './types';
import { profileHostHardware } from './services/hardwareProfiler';
import { generateGhostKey } from './services/cryptoEngine';
import { sound } from './services/sound';

import { NavigationHeader } from './components/NavigationHeader';
import { StealthCalculator } from './components/StealthCalculator';
import { FeaturesSuiteModal } from './components/FeaturesSuiteModal';

import { MakiPublicTerminal } from './components/modules/MakiPublicTerminal';
import { Module1Generation } from './components/modules/Module1Generation';
import { ModuleMakiUncensored } from './components/modules/ModuleMakiUncensored';
import { ModuleSatoshiStream } from './components/modules/ModuleSatoshiStream';
import { ModuleUncensoredAiList } from './components/modules/ModuleUncensoredAiList';
import { Module2GhostMesh } from './components/modules/Module2GhostMesh';
import { Module3ZeroKnowledge } from './components/modules/Module3ZeroKnowledge';
import { Module4Multimodal } from './components/modules/Module4Multimodal';
import { Module5CypherpunkBtc } from './components/modules/Module5CypherpunkBtc';
import { Module6AgenticAutomation } from './components/modules/Module6AgenticAutomation';
import { Module7MonetizationEconomy } from './components/modules/Module7MonetizationEconomy';
import { Module8PostQuantumCovert } from './components/modules/Module8PostQuantumCovert';

export default function App() {
  // Host Hardware Profiling & Dynamic Tiering (Features 1-6)
  // Eagerly profile on initial state declaration to prevent undefined access
  const [profile, setProfile] = useState<HardwareProfile>(() => profileHostHardware());
  const [activeTab, setActiveTab] = useState<ActiveModuleTab>('public-terminal');
  const [isDecoyMode, setIsDecoyMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showFeaturesModal, setShowFeaturesModal] = useState<boolean>(false);

  // Ghost Key (Features 76-79)
  const [ghostKey, setGhostKey] = useState<string>(() => generateGhostKey());

  // Profile host device on initial launch for fine-grained updates
  useEffect(() => {
    const prof = profileHostHardware();
    setProfile(prof);
  }, []);

  // Global key listener for acoustics and panic hotkey (Escape x3 or Panic)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't override if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'Escape') {
        handleTriggerPanic();
        return;
      }
      if (soundEnabled) {
        sound.playKeyClick('blue');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [soundEnabled]);

  // Toggle Decoy Calculator (Panic Mode)
  const handleTriggerPanic = () => {
    sound.playTerminalBeep(350, 0.15);
    setIsDecoyMode(true);
  };

  // Unlock from Decoy Calculator
  const handleUnlockMaki = () => {
    sound.playTerminalBeep(1200, 0.1);
    setIsDecoyMode(false);
  };

  // Duress Wipe: clear keys and stay in decoy
  const handleDuressWipe = () => {
    setGhostKey(generateGhostKey());
    setIsDecoyMode(true);
  };

  // If in Decoy Mode, display the functional Stealth Calculator
  if (isDecoyMode) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <StealthCalculator
          onUnlock={handleUnlockMaki}
          onDuressWipe={handleDuressWipe}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010802] text-[#00FF66] font-mono crt-scanlines selection:bg-[#00FF66] selection:text-black">
      {/* Shell Navigation Header */}
      <NavigationHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hardware={profile}
        onPanicTrigger={handleTriggerPanic}
        soundEnabled={soundEnabled}
        setSoundEnabled={(enabled) => {
          sound.setEnabled(enabled);
          setSoundEnabled(enabled);
        }}
        ghostKeyFingerprint={ghostKey.slice(0, 8) + '...'}
        onOpenFeaturesModal={() => setShowFeaturesModal(true)}
      />

      {/* Main Module Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'public-terminal' && (
          <MakiPublicTerminal
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'engine' && (
          <Module1Generation
            hardware={profile}
            setHardware={setProfile}
          />
        )}

        {activeTab === 'maki-uncensored' && (
          <ModuleMakiUncensored />
        )}

        {activeTab === 'satoshistream' && (
          <ModuleSatoshiStream 
            onNavigateToModule={(mod) => {
              if (mod === 'mod-generation') setActiveTab('engine');
              else if (mod === 'mod-uncensored') setActiveTab('maki-uncensored');
            }}
          />
        )}

        {activeTab === 'uncensored-models' && (
          <ModuleUncensoredAiList 
            onSelectModelToRun={() => {
              setActiveTab('maki-uncensored');
            }}
          />
        )}

        {activeTab === 'quantum-mesh' && (
          <Module2GhostMesh />
        )}

        {activeTab === 'zero-knowledge' && (
          <Module3ZeroKnowledge
            ghostKey={ghostKey}
            setGhostKey={setGhostKey}
            onTriggerPanic={handleTriggerPanic}
            onDuressWipe={handleDuressWipe}
          />
        )}

        {activeTab === 'multimodal' && (
          <Module4Multimodal />
        )}

        {activeTab === 'cypherpunk-btc' && (
          <Module5CypherpunkBtc />
        )}

        {activeTab === 'agentic' && (
          <Module6AgenticAutomation />
        )}

        {activeTab === 'monetization' && (
          <Module7MonetizationEconomy />
        )}

        {activeTab === 'post-quantum' && (
          <Module8PostQuantumCovert />
        )}

        {activeTab === 'feature-suite' && (
          <div className="bg-[#030d05] border border-[#00FF66]/30 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Maki 236 Capability Suite Matrix</h2>
            <p className="text-xs text-[#00FF66]/70 mb-4 max-w-xl mx-auto">
              Inspect the comprehensive cryptographic, peer-to-peer, generative neural, and cypherpunk feature ledger.
            </p>
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="px-6 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            >
              Open Full 236-Feature Ledger Inspector
            </button>
          </div>
        )}
      </main>

      {/* Full 236 Feature Capability Suite Modal */}
      {showFeaturesModal && (
        <FeaturesSuiteModal onClose={() => setShowFeaturesModal(false)} />
      )}

      {/* Status Bar / Footer */}
      <footer className="border-t border-[#00FF66]/20 bg-black/80 py-4 px-4 sm:px-6 mt-12 text-[11px] font-mono text-[#00FF66]/70 space-y-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-[#00FF66]/10 pb-3">
          <div className="flex items-center gap-2 text-[#00FF66] font-semibold text-center md:text-left">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse shrink-0"></span>
            <span>No accounts, no KYC, completely anonymous. Funds route directly to your non-custodial wallet.</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#00FF66]/60">
            <span className="px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/20">POLLINATIONS AI</span>
            <span className="px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/20">GEMINI UNFILTERED</span>
            <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">SATOSHISTREAM 50 SATS</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span>MAKI CORE: SOVEREIGN AIR-GAP</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline">236 ACTIVE CAPABILITIES</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline">100MB BASE SHELL</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="hover:text-[#00FF66] underline cursor-pointer"
            >
              [236 FEATURES DIRECTORY]
            </button>
            <span>PANIC HOTKEY: [ESC] DECOY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
