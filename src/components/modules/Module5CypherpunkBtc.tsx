import React, { useState, useEffect } from 'react';
import { BitcoinTransaction } from '../../types';
import { sound } from '../../services/sound';
import { 
  Coins, 
  Zap, 
  ShieldCheck, 
  Layers, 
  QrCode, 
  Radio, 
  Terminal, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';

export const Module5CypherpunkBtc: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lightning' | 'onchain' | 'silent' | 'coinjoin'>('lightning');

  // Lightning Invoice State (Feature 164)
  const [invoiceAmountSats, setInvoiceAmountSats] = useState<number>(250);
  const [invoiceGenerated, setInvoiceGenerated] = useState<boolean>(true);
  const [invoiceStatus, setInvoiceStatus] = useState<'UNPAID' | 'SETTLING' | 'SETTLED'>('SETTLED');
  const [lightningInvoiceStr, setLightningInvoiceStr] = useState<string>(
    'lnbc2500n1p3maki...z09f8a32kln7'
  );

  // Anonymity & CoinJoin Mixing State (Feature 171)
  const [isMixing, setIsMixing] = useState<boolean>(false);
  const [anonymitySet, setAnonymitySet] = useState<number>(108);

  // Live Mempool Telemetry & ASCII Stream (Features 173, 175)
  const [mempoolFee, setMempoolFee] = useState<{ fast: number; med: number; slow: number }>({
    fast: 14,
    med: 11,
    slow: 8,
  });

  const [asciiLogs, setAsciiLogs] = useState<string[]>([
    '03:22:14 [TOR:ONION] Connected to 3-hop circuit: de.tor -> is.tor -> btcpay.maki.onion',
    '03:22:18 [MEMPOOL] Height #889,412 mined // Median fee: 11 sat/vB // Pool: 42MB',
    '03:22:21 [BIP352] Silent Payment key derived: sp1qq9a...04bc // Zero address reuse',
    '03:22:25 [WABISABI] Round #441 registered: 120 UTXOs pooled // Anonymity set: 108',
    '03:22:31 [LIGHTNING] Peer connected via Tor // Node alias: [Maki-Citadel-LN]',
  ]);

  // Append real-time falling telemetry logs
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        `[MEMPOOL] Unconfirmed txs: 184,${Math.floor(Math.random() * 900 + 100)} // Block fee: ${Math.floor(Math.random() * 4 + 10)} sat/vB`,
        `[TOR:CIRCUIT] Guard node ping: ${(Math.random() * 10 + 42).toFixed(1)}ms // 0 dropped frames`,
        `[PAYJOIN] BIP-78 collaborative PSBT signature matched between 2 sovereign nodes`,
        `[ZKP-PREIMAGE] SHA256(Preimage) verified locally // Zero telemetry disclosed`,
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const time = new Date().toLocaleTimeString();
      setAsciiLogs((prev) => [...prev.slice(-7), `${time} ${randomMsg}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateInvoice = () => {
    sound.playTerminalBeep(1100, 0.08);
    setInvoiceStatus('UNPAID');
    setLightningInvoiceStr(`lnbc${invoiceAmountSats * 10}n1p3maki${Math.floor(Math.random() * 999999)}`);
  };

  const handleSimulatePayment = () => {
    sound.playTerminalBeep(880, 0.1);
    setInvoiceStatus('SETTLING');
    setTimeout(() => {
      sound.playKeyClick('relay');
      setInvoiceStatus('SETTLED');
    }, 600);
  };

  const handleTriggerCoinJoin = () => {
    sound.playTerminalBeep(650, 0.15);
    setIsMixing(true);
    setTimeout(() => {
      setAnonymitySet((prev) => prev + 16);
      setIsMixing(false);
      sound.playKeyClick('relay');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Module 5 Header Banner */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                MODULE 05
              </span>
              <span>Cypherpunk Bitcoin & Anonymous Financial Engine [Features 161–185]</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF66] glow-green mt-1 flex items-center gap-2">
              <Coins className="w-5 h-5" /> Sovereign Bitcoin & Tor Payment Stack
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Self-hosted BTCPay Server over Tor (.onion), sub-second Lightning micropayments (Satoshis), 
              BIP 352 Silent Payments, BIP 78 PayJoin, and WabiSabi CoinJoin mixing for untraceable financial privacy.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-2.5 py-1 bg-black/60 border border-[#00FF66]/30 rounded text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
              <span>MEMPOOL: {mempoolFee.med} sat/vB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Payment Controller vs Live Mempool ASCII Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sovereign Bitcoin Engine (Lightning, Silent Payments, CoinJoin) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-tabs for Bitcoin features */}
          <div className="flex items-center gap-1 border-b border-[#00FF66]/20 font-mono text-xs">
            {[
              { id: 'lightning', label: 'Lightning Satoshis (F164)', icon: <Zap className="w-3.5 h-3.5" /> },
              { id: 'silent', label: 'BIP 352 Silent Pay (F168)', icon: <Lock className="w-3.5 h-3.5" /> },
              { id: 'coinjoin', label: 'WabiSabi CoinJoin (F171)', icon: <Layers className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sound.playKeyClick('blue');
                  setActiveTab(t.id as any);
                }}
                className={`px-3 py-1.5 rounded-t transition-all flex items-center gap-1.5 ${
                  activeTab === t.id
                    ? 'bg-[#00FF66]/20 text-[#00FF66] border-b-2 border-[#00FF66] font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#00FF66]/5'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: Lightning Micropayments (Satoshis) */}
          {activeTab === 'lightning' && (
            <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#00FF66] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Instant Lightning Network Micro-Invoice
                </span>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  invoiceStatus === 'SETTLED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}>
                  {invoiceStatus}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#00FF66]/70">AMOUNT (SATOSHIS):</span>
                {[50, 250, 1000, 5000].map((sats) => (
                  <button
                    key={sats}
                    onClick={() => {
                      sound.playKeyClick('brown');
                      setInvoiceAmountSats(sats);
                    }}
                    className={`px-2 py-1 rounded border ${
                      invoiceAmountSats === sats
                        ? 'bg-[#00FF66] text-black font-bold border-[#00FF66]'
                        : 'bg-black/50 text-[#00FF66]/70 border-[#00FF66]/20 hover:bg-[#00FF66]/10'
                    }`}
                  >
                    {sats} sats
                  </button>
                ))}
              </div>

              {/* Encrypted SVG QR Code Simulation */}
              <div className="bg-black/70 p-4 rounded border border-[#00FF66]/30 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-32 bg-white p-2 rounded flex flex-wrap gap-0.5 items-center justify-center shrink-0">
                  {/* Generated SVG Matrix QR dots */}
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        (i * 13 + invoiceAmountSats) % 2 === 0 ? 'bg-black' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="text-[10px] text-[#00FF66]/60">LIGHTNING INVOICE STRING (BOLT-11):</div>
                  <div className="p-2 bg-black rounded border border-[#00FF66]/20 text-[10px] break-all text-emerald-300">
                    {lightningInvoiceStr}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateInvoice}
                      className="px-2.5 py-1 rounded bg-[#00FF66]/10 hover:bg-[#00FF66]/20 border border-[#00FF66]/30 text-[#00FF66] text-[10px] font-bold"
                    >
                      NEW INVOICE
                    </button>
                    <button
                      onClick={handleSimulatePayment}
                      className="px-2.5 py-1 rounded bg-[#00FF66] text-black text-[10px] font-bold hover:bg-[#33ff88]"
                    >
                      SIMULATE LN PAYMENT (PREIMAGE)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#00FF66]/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Knowledge Proof of Preimage: Settles instantly without user identifiers.</span>
              </div>
            </div>
          )}

          {/* TAB 2: BIP 352 Silent Payments */}
          {activeTab === 'silent' && (
            <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3 font-mono text-xs">
              <span className="font-bold text-[#00FF66] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" /> BIP 352 Silent Payments (Feature 168)
              </span>
              <p className="text-[#00FF66]/70">
                Silent Payments prevent blockchain address reuse. You share a single static identifier, and sender uses Diffie-Hellman key exchange to derive a unique one-time on-chain Taproot address that only you can spend.
              </p>

              <div className="p-3 bg-black/80 rounded border border-[#00FF66]/30 space-y-2">
                <div className="text-[10px] text-[#00FF66]/60">STATIC SILENT PAYMENT ADDRESS:</div>
                <div className="text-white font-bold break-all">
                  sp1qq9ae4maki88f04bc12a9e87701xq92k4ln08pz
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-[#00FF66]/10">
                  On-chain analytics cannot link incoming UTXOs to this address or each other.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WabiSabi CoinJoin Mixing */}
          {activeTab === 'coinjoin' && (
            <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#00FF66] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" /> WabiSabi CoinJoin Decentralized Mixing (Feature 171)
                </span>
                <span className="text-[10px] text-purple-400 font-bold">ANONYMITY SET: {anonymitySet}</span>
              </div>

              <p className="text-[#00FF66]/70">
                Mixes your unspent outputs (UTXOs) with hundreds of network participants over Tor. Breaks blockchain tracing heuristics and cluster graphs.
              </p>

              <button
                onClick={handleTriggerCoinJoin}
                disabled={isMixing}
                className="w-full py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 font-bold rounded text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMixing ? 'animate-spin' : ''}`} />
                <span>{isMixing ? 'MIXING INPUTS OVER TOR CIRCUIT...' : 'ENGAGE WABISABI MIXING ROUND'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Retro CRT Matrix ASCII Telemetry Stream (Features 174–175) */}
        <div className="lg:col-span-5 p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 flex flex-col h-[340px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#00FF66] animate-pulse" /> ASCII Mempool Telemetry Stream (Feature 175)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">TOR .ONION ROUTED</span>
          </div>

          {/* ASCII Log Container with CRT Green Theme */}
          <div className="flex-1 bg-black p-2.5 rounded border border-[#00FF66]/20 font-mono text-[11px] text-[#00FF66] overflow-y-auto space-y-1.5 leading-relaxed shadow-inner">
            <div className="text-emerald-500 font-bold border-b border-[#00FF66]/20 pb-1">
              *** MAKI CYPHRPUNK TELEMETRY FEED (BTC / LN / TOR) ***
            </div>
            {asciiLogs.map((log, idx) => (
              <div key={idx} className="opacity-90 hover:opacity-100 transition-opacity">
                {log}
              </div>
            ))}
            <div className="text-[#00FF66] animate-pulse font-bold">
              &gt; _
            </div>
          </div>

          <div className="mt-2 text-[10px] text-[#00FF66]/60 font-mono flex justify-between">
            <span>TOR CIRCUIT: 3 HOPS (OK)</span>
            <span>MEMPOOL MED: {mempoolFee.med} SAT/vB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
