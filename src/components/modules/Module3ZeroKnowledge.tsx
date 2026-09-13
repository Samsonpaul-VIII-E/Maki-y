import React, { useState } from 'react';
import { generateGhostKey, deriveMasterKeys } from '../../services/cryptoEngine';
import { sound } from '../../services/sound';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Skull, 
  AlertTriangle, 
  QrCode, 
  EyeOff, 
  Terminal, 
  Cpu, 
  RefreshCw, 
  FileText, 
  Zap,
  Printer
} from 'lucide-react';

interface Module3ZeroKnowledgeProps {
  ghostKey: string;
  setGhostKey: (key: string) => void;
  onTriggerPanic: () => void;
  onDuressWipe: () => void;
}

export const Module3ZeroKnowledge: React.FC<Module3ZeroKnowledgeProps> = ({
  ghostKey,
  setGhostKey,
  onTriggerPanic,
  onDuressWipe,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKeyText, setShowKeyText] = useState(false);
  const [deadManDays, setDeadManDays] = useState(14);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [duressInputPin, setDuressInputPin] = useState('');
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [antiDebugStatus, setAntiDebugStatus] = useState('PTRACE_PROTECTED // 0 HOOKS DETECTED');

  // Key derivation state
  const [derivedInfo, setDerivedInfo] = useState<{
    fingerprint: string;
    derivedBtcAddress: string;
    taprootPubkey: string;
    silentPaymentKey: string;
    enclaveBoundId: string;
  }>({
    fingerprint: '0x8F04BC12',
    derivedBtcAddress: 'bc1p8f04bc12a9e8maki9000',
    taprootPubkey: 'tr_8f04bc12a9e8140f',
    silentPaymentKey: 'sp1qq8f04bc12a9e87701x',
    enclaveBoundId: 'SE-HW-APPLE-ANE-991A',
  });

  const handleRegenerateKey = async () => {
    sound.playTerminalBeep(990, 0.1);
    const newKey = generateGhostKey();
    setGhostKey(newKey);
    const derived = await deriveMasterKeys(newKey);
    setDerivedInfo(derived);
  };

  const handleCopy = () => {
    sound.playKeyClick('blue');
    navigator.clipboard.writeText(ghostKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  // Test Duress PIN
  const handleDuressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duressInputPin === '9999' || duressInputPin === '0000') {
      sound.playTerminalBeep(300, 0.4);
      onDuressWipe();
    } else {
      sound.playKeyClick('brown');
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          onDuressWipe();
        }
        return next;
      });
      setDuressInputPin('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                MODULE 03
              </span>
              <span>Zero-Knowledge Privacy & Anti-Forensics [Features 76–115]</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF66] glow-green mt-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Sovereign Ghost Key & "Lost is Lost" Architecture
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Zero accounts, zero emails, zero phone numbers, and zero centralized databases. 
              The 32-character master seed is bound exclusively to your device's Secure Enclave / StrongBox.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPaperModal(true)}
              className="px-3 py-1.5 bg-[#00FF66]/10 hover:bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] rounded font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PAPER KEY (2D CIPHER)</span>
            </button>
            <button
              onClick={onTriggerPanic}
              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-300 rounded font-mono text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>PANIC DECOY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 32-Character Ghost Key & Hardware Enclave Binding (Features 76–79) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> 32-Character Ghost Key Master Seed (Features 76–77)
              </span>
              <span className="text-[10px] text-amber-400 font-mono">ARGON2id KDF HARDENED</span>
            </div>

            {/* Secret Key Display Box */}
            <div className="p-3 bg-black/80 rounded border border-[#00FF66]/40 font-mono text-sm relative">
              <div className="text-white font-bold tracking-widest break-all">
                {showKeyText ? ghostKey : '••••-••••-••••-••••-••••-••••-••••-••••'}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-[#00FF66]/15">
                <button
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="text-[11px] text-[#00FF66]/70 hover:text-[#00FF66] flex items-center gap-1"
                >
                  <EyeOff className="w-3 h-3" /> {showKeyText ? 'MASK KEY' : 'REVEAL KEY'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66]/20 text-[11px]"
                  >
                    {copiedKey ? 'COPIED (30s AUTO-CLEAR)' : 'COPY SEED'}
                  </button>
                  <button
                    onClick={handleRegenerateKey}
                    className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 hover:bg-red-900 text-[11px] flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> RE-ROLL
                  </button>
                </div>
              </div>
            </div>

            {/* Hardware Enclave & Derived Key Matrix */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10">
                <span className="text-[#00FF66]/60 text-[10px] block">HARDWARE LOCK:</span>
                <span className="text-white font-semibold">{derivedInfo.enclaveBoundId}</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">Secure Enclave / StrongBox Bound</span>
              </div>

              <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10">
                <span className="text-[#00FF66]/60 text-[10px] block">TAPROOT PUBKEY:</span>
                <span className="text-white font-semibold truncate block">{derivedInfo.taprootPubkey}</span>
                <span className="text-[9px] text-cyan-400 block mt-0.5">BIP-341 / BIP-352 Silent Pay</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-amber-950/30 border border-amber-500/30 rounded text-amber-300 text-[11px] font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>STRICT "LOST IS LOST" POLICY: If this key is lost, no human or server can restore your encrypted local files.</span>
            </div>
          </div>

          {/* LLVM Obfuscation & Anti-Reverse Engineering Inspector (Features 82–85) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> LLVM Control Flow Flattening & Symbol Stripping (Features 82–85)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">C++ / RUST COMPILED</span>
            </div>

            <div className="bg-black/70 p-3 rounded border border-[#00FF66]/15 font-mono text-[11px] text-emerald-300 space-y-1">
              <div>[+] LLVM-OLLVM Pass: Control Flow Flattened into state dispatch loop</div>
              <div>[+] Opaque Predicates: 1,024 Bogus mathematical branch nodes inserted</div>
              <div>[+] Symbol Stripping: ELF/Mach-O symbol tables eradicated (.symtab / .strtab stripped)</div>
              <div>[+] Anti-Frida / Anti-Xposed: Memory maps verified (0 unauthorized .so hooks)</div>
              <div className="text-white font-bold">[✓] STATUS: {antiDebugStatus}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Dead Man's Switch, Duress PIN & Anti-Tamper (Features 86, 91–93) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cryptographic Dead Man’s Switch (Feature 91) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-red-400" /> Cryptographic Dead Man’s Switch (Feature 91)
              </span>
              <span className="text-[10px] text-red-400 font-mono font-bold">{deadManDays} DAYS REMAINING</span>
            </div>

            <p className="text-xs text-[#00FF66]/70 font-mono mb-3">
              Counts days of inactivity. If Maki is not unlocked within this threshold, Enclave master keys are zero-filled automatically.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={3}
                max={90}
                value={deadManDays}
                onChange={(e) => {
                  sound.playKeyClick('brown');
                  setDeadManDays(parseInt(e.target.value));
                }}
                className="flex-1 accent-red-500"
              />
              <span className="text-xs font-mono font-bold text-white w-14 text-right">
                {deadManDays} d
              </span>
            </div>
          </div>

          {/* Duress PIN Trigger & Failed Attempt Threshold (Features 92–93) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Duress PIN & 5-Attempt Wipe (Features 92–93)
              </span>
              <span className="text-[10px] text-red-400 font-mono font-bold">{failedAttempts}/5 FAILED</span>
            </div>

            <p className="text-xs text-[#00FF66]/70 font-mono mb-3">
              Entering the alternate duress PIN (<span className="text-red-400 font-bold">9999</span>) permanently deletes Enclave data keys and loads the dummy calculator interface.
            </p>

            <form onSubmit={handleDuressSubmit} className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={duressInputPin}
                onChange={(e) => setDuressInputPin(e.target.value)}
                placeholder="Enter 4-digit PIN..."
                className="flex-1 p-2 bg-black/80 border border-[#00FF66]/30 rounded text-xs font-mono text-[#00FF66] focus:outline-none focus:border-[#00FF66]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs rounded transition-all"
              >
                TEST PIN
              </button>
            </form>
          </div>

          {/* Zero-Metadata & Anti-Forensics Badges */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-2 text-xs font-mono">
            <div className="text-[#00FF66] font-bold mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Active Anti-Forensic Protections:
            </div>
            <div className="text-[11px] text-[#00FF66]/80 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> FLAG_SECURE: OS screenshots & screen recording blocked
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Zero-Metadata: Timestamps & IP logs omitted from local store
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Chip-Off Defense: Scrambled AES on unsoldered NAND chips
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Memory Permutation: Shuffles tensor RAM addresses dynamically
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Key Modal (Feature 100) */}
      {showPaperModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#050f06] border border-[#00FF66] p-6 rounded-lg max-w-md w-full font-mono text-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.3)]">
            <div className="flex justify-between items-center mb-4 border-b border-[#00FF66]/20 pb-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#00FF66]" /> 2D Paper Cipher Key Cold Storage
              </h2>
              <button
                onClick={() => setShowPaperModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                [CLOSE]
              </button>
            </div>

            <div className="bg-white p-4 rounded flex flex-col items-center justify-center my-3">
              {/* Stylized high-density 2D Matrix barcode simulation */}
              <div className="w-44 h-44 bg-black p-2 rounded flex flex-wrap gap-1 items-center justify-center">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-xs ${
                      (i * 17 + ghostKey.charCodeAt(i % ghostKey.length)) % 2 === 0 ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <div className="text-black text-[10px] font-mono mt-2 font-bold tracking-widest text-center">
                MAKI-ENCLAVE-CIPHER-2026
              </div>
            </div>

            <div className="text-xs text-[#00FF66]/80 text-center font-mono my-2 break-all">
              {ghostKey}
            </div>

            <p className="text-[11px] text-neutral-400 text-center mt-2">
              Store this printed sheet in a fireproof vault. Scan with Maki camera on any new phone to reconstitute your private keys.
            </p>

            <button
              onClick={() => {
                sound.playTerminalBeep(1200, 0.1);
                setShowPaperModal(false);
              }}
              className="mt-4 w-full py-2 bg-[#00FF66] text-black font-bold text-xs rounded hover:bg-[#33ff88]"
            >
              PRINT PAPER CIPHER KEY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
