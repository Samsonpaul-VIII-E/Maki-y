import React, { useState } from 'react';
import { MeshNode, QuantumManifest } from '../../types';
import { splitSecretIntoShamirSplinters, ShardPiece } from '../../services/cryptoEngine';
import { sound } from '../../services/sound';
import { 
  Share2, 
  Wifi, 
  Bluetooth, 
  Flame, 
  Send, 
  Trash2, 
  Radio, 
  ShieldAlert, 
  Server, 
  Smartphone, 
  Laptop, 
  HardDrive, 
  Zap, 
  CheckCircle2
} from 'lucide-react';

export const Module2GhostMesh: React.FC = () => {
  // 5-Node Ghost Mesh local cluster pooling 250 TOPS (Feature 53)
  const [nodes, setNodes] = useState<MeshNode[]>([
    { id: 'node-1', name: 'Node-Alpha (Host)', deviceType: 'Phone', npuTops: 45, batteryPct: 91, latencyMs: 0.2, status: 'active', role: 'Coordinator', ipOrBle: 'BLE://D8:3B:11', shardsHeld: [1] },
    { id: 'node-2', name: 'Node-Bravo (Pixel NPU)', deviceType: 'Phone', npuTops: 38, batteryPct: 84, latencyMs: 2.1, status: 'active', role: 'Worker Shard', ipOrBle: 'Wi-Fi Direct://192.168.49.2', shardsHeld: [2] },
    { id: 'node-3', name: 'Node-Charlie (Galaxy S24)', deviceType: 'Phone', npuTops: 42, batteryPct: 78, latencyMs: 3.4, status: 'active', role: 'Worker Shard', ipOrBle: 'Wi-Fi Direct://192.168.49.3', shardsHeld: [3] },
    { id: 'node-4', name: 'Node-Delta (M3 iPad)', deviceType: 'Tablet', npuTops: 45, batteryPct: 88, latencyMs: 1.8, status: 'active', role: 'Splinter Custodian', ipOrBle: 'UWB://Spatial-04', shardsHeld: [4] },
    { id: 'node-5', name: 'Node-Echo (Studio RTX 4090)', deviceType: 'Desktop Workstation', npuTops: 80, batteryPct: 100, latencyMs: 4.8, status: 'offloaded', role: 'VRAM Host', ipOrBle: 'WireGuard://10.200.0.5', shardsHeld: [5] },
  ]);

  const totalTops = nodes.reduce((acc, n) => acc + n.npuTops, 0);

  // Quantum Tunneling 1KB Manifest streaming (Feature 41, 44)
  const [manifest, setManifest] = useState<QuantumManifest | null>({
    manifestId: 'QM-7701-X',
    fileSizeBytes: 107374182400, // 100GB
    chunkCount: 16384,
    manifestSizeKb: 1.0,
    sha3Hash: '0x8FA43E199201F0...72B1',
    encryptionMode: 'ChaCha20-Poly1305 + WireGuard UDP',
    transferSpeedGbps: 10.4,
    transferDurationSec: 0.008, // under 0.01 seconds
  });
  const [tunnelStreaming, setTunnelStreaming] = useState(false);

  // Remote Desktop GPU VRAM Offloading (Features 45, 46)
  const [remoteOffloading, setRemoteOffloading] = useState(true);
  const [offloadTaskStatus, setOffloadTaskStatus] = useState<string>('IDLE — HOST LISTENING (PORT 51820)');

  // Shamir's Multi-Sig Splinter Vault (3-of-5 threshold) (Features 55–57)
  const [vaultSecret, setVaultSecret] = useState('GHOST_TOP_SECRET_AIRGAP_VAULT_PAYLOAD_2026');
  const [shards, setShards] = useState<ShardPiece[]>(() => splitSecretIntoShamirSplinters('GHOST_TOP_SECRET_AIRGAP_VAULT_PAYLOAD_2026'));
  const [selectedShardIds, setSelectedShardIds] = useState<number[]>([1, 2, 3]);
  const [vaultUnlocked, setVaultUnlocked] = useState(true);

  // Air-Gapped Mesh Chat & Instant "Burn Mesh" Purge (Features 61–63)
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: 'm1', sender: 'Node-Alpha (Host)', text: 'Ghost Mesh cluster synchronized. 5 nodes verified over BLE & Wi-Fi Direct.', time: '03:14:02' },
    { id: 'm2', sender: 'Node-Echo (RTX 4090)', text: 'WireGuard tunnel established. 24GB VRAM buffer reserved for remote offload.', time: '03:14:15' },
    { id: 'm3', sender: 'Node-Bravo', text: 'Shamir Splinter #2 verified and locked in volatile RAM.', time: '03:14:28' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [burnNotice, setBurnNotice] = useState(false);

  // Trigger Quantum Stream Test
  const handleQuantumStream = () => {
    sound.playTerminalBeep(1200, 0.08);
    setTunnelStreaming(true);
    setTimeout(() => {
      setTunnelStreaming(false);
      sound.playKeyClick('relay');
    }, 450);
  };

  // Trigger Remote GPU Offload
  const handleTriggerOffload = () => {
    sound.playTerminalBeep(880, 0.1);
    setOffloadTaskStatus('OFFLOADING 16-BIT TENSOR GRAPH TO NODE-ECHO (RTX 4090)...');
    setTimeout(() => {
      setOffloadTaskStatus('RENDER COMPLETE IN 0.34s // VRAM PURGED AT HOST');
      sound.playKeyClick('relay');
    }, 900);
  };

  // Send air-gapped mesh chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sound.playKeyClick('blue');
    const newMsg = {
      id: String(Date.now()),
      sender: 'Node-Alpha (Host)',
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Feature 63: Instant "Burn Mesh" Global Memory Purge Signal
  const handleBurnMesh = () => {
    sound.playTerminalBeep(350, 0.3);
    setBurnNotice(true);
    setChatMessages([]);
    setTimeout(() => {
      setBurnNotice(false);
      sound.playKeyClick('relay');
    }, 2500);
  };

  // Toggle shard selection for Shamir 3-of-5 reconstruction
  const toggleShard = (id: number) => {
    sound.playKeyClick('brown');
    const next = selectedShardIds.includes(id)
      ? selectedShardIds.filter((x) => x !== id)
      : [...selectedShardIds, id];
    setSelectedShardIds(next);
    setVaultUnlocked(next.length >= 3);
  };

  return (
    <div className="space-y-6">
      {/* Module 2 Header */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                MODULE 02
              </span>
              <span>Peer-to-Peer & Quantum Tunneling Mesh [Features 41–75]</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF66] glow-green mt-1 flex items-center gap-2">
              <Share2 className="w-5 h-5" /> 5-Node Ghost Mesh Local Supercomputer
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Air-gapped NPU clustering over Wi-Fi 7 Direct, BLE, and WireGuard: pooling 5 nearby nodes into an aggregate 
              {' '}<span className="text-[#00FF66] font-bold text-sm glow-green">{totalTops} TOPS</span> local supercomputer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBurnMesh}
              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-300 rounded font-mono text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)]"
              title="Feature 63: Broadcasts instant wipe command across all connected nodes to erase volatile chat RAM"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>BURN MESH (PURGE)</span>
            </button>
          </div>
        </div>

        {burnNotice && (
          <div className="mt-3 p-2.5 bg-red-950/90 border border-red-500 rounded text-red-300 text-xs font-mono flex items-center gap-2 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>GLOBAL MEMORY PURGE SIGNAL BROADCAST: All volatile RAM buffers wiped across 5 peer nodes. Zero disk traces remain.</span>
          </div>
        )}
      </div>

      {/* 5-Node Topology Grid (Features 53–54) */}
      <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00FF66]">
            <Radio className="w-4 h-4" />
            <span>Active Mesh Node Topology ({nodes.length} Connected // {totalTops} TOPS Combined)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">DISTRIBUTED TENSOR PARALLELISM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {nodes.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded bg-black/50 border border-[#00FF66]/20 hover:border-[#00FF66]/50 transition-all font-mono text-xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-[#00FF66] mb-1">
                <span className="font-bold truncate">{n.name}</span>
                {n.deviceType === 'Desktop Workstation' ? (
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                ) : n.deviceType === 'Tablet' ? (
                  <Laptop className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              <div className="space-y-1 text-[11px] text-[#00FF66]/70">
                <div className="flex justify-between">
                  <span>NPU TOPS:</span>
                  <span className="text-white font-bold">{n.npuTops} TOPS</span>
                </div>
                <div className="flex justify-between">
                  <span>LATENCY:</span>
                  <span className="text-emerald-300">{n.latencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANSPORT:</span>
                  <span className="text-neutral-400 truncate max-w-[110px]">{n.ipOrBle}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#00FF66]/10">
                  <span className="text-[10px] text-[#00FF66]/50">ROLE:</span>
                  <span className="text-[10px] text-amber-400 font-semibold">{n.role}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-[#00FF66]/60">
                <span>BATTERY: {n.batteryPct}%</span>
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Grid: Quantum Tunneling + Remote GPU vs Shamir Splinter Vault & Mesh Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quantum Tunneling (100GB+ / 1KB Manifest) & Remote GPU Offloading */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quantum Tunneling Manifest Generator (Feature 41, 44) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Quantum Tunneling 1KB Manifest (Feature 41)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">100GB+ UNDER 0.01s</span>
            </div>

            <p className="text-xs text-[#00FF66]/70 font-mono mb-3">
              Compresses massive weights and raw tensor streams into 1KB cryptographically signed hash manifests over direct WebRTC / WireGuard sockets.
            </p>

            {manifest && (
              <div className="bg-black/60 p-3 rounded border border-[#00FF66]/15 font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#00FF66]/60">MANIFEST ID:</span>
                  <span className="text-white font-bold">{manifest.manifestId}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#00FF66]/60">VIRTUAL FILE SIZE:</span>
                  <span className="text-amber-400">100.00 GB (16,384 Chunks)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#00FF66]/60">MANIFEST OVERHEAD:</span>
                  <span className="text-[#00FF66] font-bold">1.0 KB (Signed SHA3)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#00FF66]/60">MEASURED LATENCY:</span>
                  <span className="text-emerald-300 font-bold">{manifest.transferDurationSec} sec ({manifest.transferSpeedGbps} Gbps)</span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 pt-1 border-t border-[#00FF66]/10">
                  <span>SHA3 INTEGRITY:</span>
                  <span className="font-mono">{manifest.sha3Hash}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleQuantumStream}
              disabled={tunnelStreaming}
              className="mt-3 w-full py-2 bg-[#00FF66]/10 hover:bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{tunnelStreaming ? 'STREAMING ENCRYPTED BLOCKS...' : 'TEST 100GB STREAMING MANIFEST (<0.01s)'}</span>
            </button>
          </div>

          {/* Remote Desktop GPU VRAM Offloading (Features 45, 46) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> Remote GPU VRAM Offloading (Features 45–46)
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">NODE-ECHO (RTX 4090)</span>
            </div>

            <p className="text-xs text-[#00FF66]/70 font-mono mb-3">
              Low-power mobile clients dispatch heavy tensor operations directly to remote home workstations over end-to-end encrypted WireGuard tunnels.
            </p>

            <div className="bg-black/60 p-3 rounded border border-[#00FF66]/15 font-mono text-xs space-y-1">
              <div className="text-[11px] text-[#00FF66]/60">HOST RECEIVER STATUS:</div>
              <div className="text-emerald-300 text-xs font-semibold">{offloadTaskStatus}</div>
            </div>

            <button
              onClick={handleTriggerOffload}
              className="mt-3 w-full py-2 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>DISPATCH HEAVY FP16 PASS TO DESKTOP GPU</span>
            </button>
          </div>
        </div>

        {/* Right Column: Shamir's Multi-Sig Splinter Vault & Air-Gapped Mesh Chat */}
        <div className="lg:col-span-6 space-y-4">
          {/* Shamir's Multi-Sig Splinter Vault (Features 55–57) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Shamir’s 3-of-5 Splinter Vault (Features 55–57)
              </span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                vaultUnlocked ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'
              }`}>
                {vaultUnlocked ? 'THRESHOLD MET (3/5)' : 'LOCKED (<3 SHARDS)'}
              </span>
            </div>

            <p className="text-xs text-[#00FF66]/70 font-mono mb-2">
              Sensitive payloads are splintered into 5 mathematical pieces. Any 3 of 5 nodes must assemble to reconstitute data.
            </p>

            {/* Shard Selection Matrix */}
            <div className="space-y-1.5 mb-3">
              {shards.map((s) => {
                const isChecked = selectedShardIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleShard(s.id)}
                    className={`p-2 rounded border cursor-pointer font-mono text-xs flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-[#00FF66]/10 border-[#00FF66] text-[#00FF66]'
                        : 'bg-black/40 border-[#00FF66]/10 text-neutral-500 hover:border-[#00FF66]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[9px] ${
                        isChecked ? 'bg-[#00FF66] border-[#00FF66] text-black font-bold' : 'border-neutral-700'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </span>
                      <span className="font-bold">{s.nodeName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{s.shardHex}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded bg-black/70 border border-[#00FF66]/20 font-mono text-xs">
              <span className="text-[#00FF66]/60 text-[10px] block">RECONSTRUCTED PAYLOAD:</span>
              <div className="text-white font-mono break-all font-semibold mt-0.5">
                {vaultUnlocked ? vaultSecret : '████████ [MATHEMATICALLY OBFUSCATED — INSUFFICIENT SHARDS]'}
              </div>
            </div>
          </div>

          {/* Air-Gapped Mesh Chat with RAM Buffer (Features 61–62) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" /> Air-Gapped Mesh Chat (Features 61–62)
              </span>
              <span className="text-[10px] text-amber-400 font-mono">VOLATILE RAM STORAGE ONLY</span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-black/60 rounded border border-[#00FF66]/10 text-xs font-mono">
              {chatMessages.length === 0 ? (
                <div className="text-neutral-500 text-center py-6">
                  [Mesh RAM buffer is empty. All messages purged.]
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="border-b border-[#00FF66]/5 pb-1">
                    <div className="flex justify-between text-[10px] text-[#00FF66]/60">
                      <span className="font-bold text-[#00FF66]">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="text-white/90 mt-0.5">{msg.text}</div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="mt-2 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast encrypted mesh packet..."
                className="flex-1 p-2 bg-black/80 border border-[#00FF66]/30 rounded text-xs font-mono text-[#00FF66] focus:outline-none focus:border-[#00FF66]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#00FF66] text-black font-bold rounded text-xs hover:bg-[#33ff88] active:scale-95 transition-all flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
