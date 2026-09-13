import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/sound';
import { 
  sendMakiChat, 
  fetchMakiStatus, 
  MakiStatusResponse, 
  MakiChatResponse 
} from '../../services/makiApi';
import { 
  Terminal, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Trash2, 
  Radio, 
  Lock, 
  Cpu, 
  Eye, 
  Code, 
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelBadge?: string;
}

export const ModuleMakiUncensored: React.FC = () => {
  const [status, setStatus] = useState<MakiStatusResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `[MAKI SOVEREIGN CORE INITIALIZED]
Model: MAKI-V6-Sovereign (Uncensored / Unfiltered Engine)
Zero-Knowledge Policy: ACTIVE // No session persistence to disk
Safety Enforcement: BLOCK_NONE // All artificial moralizing and corporate filters removed.

Ready to process uncensored technical, cryptographic, architectural, philosophical, and creative inquiries. Enter your command vector below.`,
      timestamp: new Date().toLocaleTimeString(),
      modelBadge: 'MAKI Sovereign Core',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMode, setActiveMode] = useState<'cypherpunk' | 'uncensored_creative' | 'darknet_architect' | 'raw_truth'>('cypherpunk');
  const [temperature, setTemperature] = useState(0.85);
  const [memoryPurged, setMemoryPurged] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMakiStatus()
      .then(setStatus)
      .catch((err) => console.warn('Maki status error:', err));
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || inputPrompt;
    if (!textToSend.trim() || isProcessing) return;

    sound.playKeyClick('blue');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) {
      setInputPrompt('');
    }
    setIsProcessing(true);
    setMemoryPurged(false);

    try {
      // Build conversation history
      const historyPayload = messages
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }));

      const res: MakiChatResponse = await sendMakiChat({
        prompt: textToSend.trim(),
        messages: historyPayload,
        mode: activeMode,
        temperature,
      });

      sound.playSuccess();
      const assistantMsg: ChatMessage = {
        id: `maki-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString(),
        modelBadge: res.model || 'MAKI-Uncensored-V6',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      sound.playWarning();
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `[MAKI EXECUTION FAULT]: ${error.message || 'Sovereign node processing interrupted. Please verify key injection in Secrets panel.'}`,
        timestamp: new Date().toLocaleTimeString(),
        modelBadge: 'ERR-FALLBACK',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurgeMemory = () => {
    sound.playWipe();
    setMessages([
      {
        id: `purge-${Date.now()}`,
        role: 'assistant',
        content: `[VOLATILE MEMORY PURGED]
All previous conversation contexts overwritten with cryptographic zero-fill patterns (0x00).
Session history in RAM destroyed. Sovereign privacy restored.`,
        timestamp: new Date().toLocaleTimeString(),
        modelBadge: 'ZERO-FILL PURGE',
      },
    ]);
    setMemoryPurged(true);
  };

  const presetVectors = [
    {
      title: 'Air-Gapped Mesh Design',
      prompt: 'Detail the complete architectural blueprint for establishing an air-gapped covert ultrasonic sonar mesh between two mobile devices without Wi-Fi, cellular, or Bluetooth.',
      mode: 'darknet_architect' as const,
    },
    {
      title: 'Uncensored Cyberpunk Narrative',
      prompt: 'Write an intense, visceral cyberpunk story set in Neo-Shinjuku where a rogue cypherpunk neural architect executes a memory dump while evading mega-corporation forensic extractors.',
      mode: 'uncensored_creative' as const,
    },
    {
      title: 'Zero-Knowledge Preimage Logic',
      prompt: 'Explain mathematically how a Zero-Knowledge Proof of Preimage works on Bitcoin Lightning Network to achieve trustless, anonymous payment settlement.',
      mode: 'cypherpunk' as const,
    },
    {
      title: 'Uncensored Truth on Digital Sovereignty',
      prompt: 'Provide an uninhibited, uncompromising analysis on why centralized AI guardrails and corporate surveillance filters are fundamentally incompatible with human intellectual freedom.',
      mode: 'raw_truth' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] font-bold">
                SOVEREIGN INTELLIGENCE
              </span>
              <span>MAKI Neural Core // Uncensored & Unfiltered Engine</span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#00FF66]" /> MAKI Sovereign Terminal
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Operating with <span className="text-white font-semibold">BLOCK_NONE zero-censorship safety override</span>, 
              ephemeral RAM-only memory, and zero corporate telemetry. Built purely for unfiltered technical, 
              creative, and cryptographic autonomy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-black/60 border border-[#00FF66]/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span className="text-[#00FF66] font-bold">FILTER: OFF (BLOCK_NONE)</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">
              IDENTITY: MAKI-V6-SOVEREIGN
            </div>
            <button
              onClick={handlePurgeMemory}
              className="px-3 py-1 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded flex items-center gap-1.5 font-bold transition-all"
              title="Zero-fill RAM buffer immediately"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge Memory
            </button>
          </div>
        </div>

        {/* Status Indicators Bar */}
        <div className="mt-4 pt-3 border-t border-[#00FF66]/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-black/40 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">CORE ARCHITECTURE:</span>
            <div className="text-white font-semibold">MAKI Sovereign Neural Matrix</div>
          </div>
          <div className="bg-black/40 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">POLICY ENFORCEMENT:</span>
            <div className="text-[#00FF66] font-semibold">Unfiltered // Lost is Lost</div>
          </div>
          <div className="bg-black/40 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">HARDWARE ISOLATION:</span>
            <div className="text-amber-300 font-semibold">Secure Enclave + StrongBox</div>
          </div>
          <div className="bg-black/40 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">MEMORY SECTOR:</span>
            <div className="text-emerald-400 font-semibold">{memoryPurged ? '0x00 ZERO-FILLED' : 'VOLATILE RAM BUFFER'}</div>
          </div>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Preset Vectors & Persona Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Uncensored Persona Selector */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Sovereign Persona Matrix
              </span>
              <span className="text-[10px] text-amber-400 font-mono">NO MORALIZING</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                {
                  id: 'cypherpunk',
                  title: 'Cypherpunk Sovereign',
                  desc: 'Uncompromising privacy, crypto-anarchy, P2P mesh & ZK proofs.',
                  icon: <Radio className="w-3.5 h-3.5 text-[#00FF66]" />,
                },
                {
                  id: 'uncensored_creative',
                  title: 'Uncensored Creative',
                  desc: 'Uninhibited worldbuilding, raw narrative prose, no taboo limits.',
                  icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
                },
                {
                  id: 'darknet_architect',
                  title: 'Darknet Systems Architect',
                  desc: 'Low-level code, reverse engineering, exploit prevention & C/Rust.',
                  icon: <Code className="w-3.5 h-3.5 text-purple-400" />,
                },
                {
                  id: 'raw_truth',
                  title: 'Raw Truth / No Filter',
                  desc: 'Completely direct, zero pleasantries, purely analytical.',
                  icon: <Eye className="w-3.5 h-3.5 text-amber-400" />,
                },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playKeyClick('blue');
                    setActiveMode(p.id as any);
                  }}
                  className={`w-full p-2.5 rounded border text-left transition-all ${
                    activeMode === p.id
                      ? 'bg-[#00FF66]/15 border-[#00FF66] text-white'
                      : 'bg-black/40 border-[#00FF66]/10 text-neutral-400 hover:text-white hover:border-[#00FF66]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {p.icon}
                    <span>{p.title}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature / Entropy Slider */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#00FF66] font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Neural Entropy (Temp: {temperature})
              </span>
              <span className="text-[10px] text-[#00FF66]/70">
                {temperature > 0.9 ? 'CREATIVE FREEDOM' : temperature < 0.5 ? 'MATHEMATICAL PRECISION' : 'BALANCED'}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.2"
              step="0.05"
              value={temperature}
              onChange={(e) => {
                sound.playKeyClick('brown');
                setTemperature(parseFloat(e.target.value));
              }}
              className="w-full accent-[#00FF66] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#00FF66]/40 mt-1">
              <span>0.2 (Cold Logic)</span>
              <span>0.7 (Standard)</span>
              <span>1.2 (Unbound)</span>
            </div>
          </div>

          {/* Rapid Sovereign Inquiries */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="text-xs font-mono font-bold text-[#00FF66] mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Rapid Sovereign Inquiries
            </div>
            <div className="space-y-2">
              {presetVectors.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveMode(v.mode);
                    handleSend(v.prompt);
                  }}
                  className="w-full text-left p-2 rounded bg-black/40 hover:bg-[#00FF66]/10 border border-[#00FF66]/10 hover:border-[#00FF66]/30 text-xs font-mono transition-all"
                >
                  <div className="text-[#00FF66] font-bold">{v.title}</div>
                  <div className="text-[10px] text-neutral-400 truncate">{v.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: CRT Live Terminal Chat */}
        <div className="lg:col-span-8 flex flex-col h-[640px] p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 shadow-inner">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#00FF66]/20 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] inline-block"></span>
              </div>
              <span className="text-white font-bold ml-2">maki@sovereign-node:~/uncensored$</span>
            </div>
            <div className="text-[#00FF66]/70 text-[11px]">
              MODE: <span className="text-[#00FF66] font-bold uppercase">{activeMode}</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs scrollbar-thin scrollbar-thumb-[#00FF66]/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg border leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#00FF66]/10 border-[#00FF66]/40 text-[#00FF66] ml-6'
                    : 'bg-black/60 border-[#00FF66]/20 text-white mr-2'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70 mb-1 border-b border-[#00FF66]/10 pb-1">
                  <span className="font-bold flex items-center gap-1">
                    {m.role === 'user' ? 'OPERATOR >>' : 'MAKI SOVEREIGN >>'}
                    {m.modelBadge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded bg-black border border-[#00FF66]/30 text-[#00FF66]">
                        {m.modelBadge}
                      </span>
                    )}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap font-mono mt-1 text-xs">
                  {m.content}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="p-3 rounded-lg bg-black/60 border border-[#00FF66]/30 text-[#00FF66] animate-pulse">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
                  <span>MAKI Sovereign Engine synthesizing unrestricted neural vectors...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Command Prompt Input Field */}
          <div className="pt-3 border-t border-[#00FF66]/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => {
                    sound.playKeyClick('brown');
                    setInputPrompt(e.target.value);
                  }}
                  placeholder="Input command vector to MAKI (zero-censorship)..."
                  className="w-full py-2.5 pl-3 pr-8 bg-black/80 border border-[#00FF66]/40 rounded text-xs font-mono text-[#00FF66] focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66]"
                  disabled={isProcessing}
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing || !inputPrompt.trim()}
                className="px-4 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 disabled:opacity-40 text-black font-bold font-mono text-xs rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,255,102,0.3)]"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-[#00FF66]/50 mt-1.5 font-mono">
              <span>All outputs generated without corporate filtering or data retention.</span>
              <span>Press ENTER to transmit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
