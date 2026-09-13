import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { 
  Flame, 
  Tv, 
  Clock, 
  Cpu, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  Sparkles,
  Zap
} from 'lucide-react';

export const Module7MonetizationEconomy: React.FC = () => {
  // Feature 209: 3-Ad "Frenzy Mode" Multiplier Trigger
  const [adsWatchedCount, setAdsWatchedCount] = useState<number>(2);
  const [frenzyActive, setFrenzyActive] = useState<boolean>(false);
  const [frenzyMinutesLeft, setFrenzyMinutesLeft] = useState<number>(30);
  const [adPlaying, setAdPlaying] = useState<boolean>(false);

  // Feature 214–216: Overnight Compute-to-Earn Harvester & Maki Coin Ledger
  const [harvesterEnabled, setHarvesterEnabled] = useState<boolean>(true);
  const [makiCoinBalance, setMakiCoinBalance] = useState<number>(142.5);
  const [earnedTokensTonight, setEarnedTokensTonight] = useState<number>(18.2);
  const [harvesterStatus, setHarvesterStatus] = useState<string>('HARVESTING IDLE NPU (45 TOPS) // BATTERY CHARGING');

  // Decentralized LoRA Marketplace (Feature 217–218)
  const [marketplaceLoras] = useState([
    { id: 'lora-1', name: 'Ghost Ronin Cyberpunk v2', creator: '0x8F4A...12E', split: '50/50', installs: '1.4k', price: 'FREE (AD-SUPPORTED)' },
    { id: 'lora-2', name: 'Kyoto Ink Wash Sumi-E', creator: '0x9B11...90F', split: '50/50', installs: '3.8k', price: '50 SATS OR 1 AD' },
    { id: 'lora-3', name: 'Dark Mecha Hard-Surface', creator: '0x3C88...44A', split: '50/50', installs: '2.1k', price: '50 SATS OR 1 AD' },
  ]);

  // Simulate Frenzy Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (frenzyActive && frenzyMinutesLeft > 0) {
      timer = setInterval(() => {
        setFrenzyMinutesLeft((prev) => {
          if (prev <= 1) {
            setFrenzyActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    }
    return () => clearInterval(timer);
  }, [frenzyActive, frenzyMinutesLeft]);

  // Watch Ad to trigger Frenzy
  const handleWatchAd = () => {
    sound.playTerminalBeep(980, 0.1);
    setAdPlaying(true);
    setTimeout(() => {
      setAdPlaying(false);
      sound.playKeyClick('relay');
      setAdsWatchedCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          setFrenzyActive(true);
          setFrenzyMinutesLeft(30);
          sound.playTerminalBeep(1300, 0.2);
          return 0;
        }
        return next;
      });
      setMakiCoinBalance((prev) => prev + 5.0);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                MODULE 07
              </span>
              <span>Monetization & Compute Economy [Features 206–221]</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF66] glow-green mt-1 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" /> Dual Privacy Monetization & Compute-to-Earn
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Sustainable privacy-first revenue: 30-minute "Ad Frenzy" multipliers, and an opt-in overnight "Compute-to-Earn" 
              background harvester renting idle NPU cycles while charging to earn ad-free access.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1 bg-black/60 border border-[#00FF66]/30 rounded text-emerald-300 font-bold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{makiCoinBalance.toFixed(1)} MAKI COINS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rewarded Ads & 30-min Ad Frenzy (Features 206, 209) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#00FF66] flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-amber-400" /> 3-Ad "Frenzy Mode" Multiplier (Feature 209)
              </span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                frenzyActive ? 'bg-amber-950 text-amber-400 border border-amber-500/40' : 'bg-[#00FF66]/10 text-[#00FF66]'
              }`}>
                {frenzyActive ? `FRENZY ACTIVE: ${frenzyMinutesLeft}m LEFT` : `${adsWatchedCount}/3 ADS WATCHED`}
              </span>
            </div>

            <p className="text-[#00FF66]/70">
              Watch 3 short rewarded privacy ads to trigger 30 minutes of completely ad-free, unthrottled generation access.
            </p>

            {/* Progress Dots */}
            <div className="flex items-center gap-2 py-1">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`flex-1 h-3 rounded flex items-center justify-center text-[10px] font-bold border transition-all ${
                    adsWatchedCount >= num || frenzyActive
                      ? 'bg-[#00FF66] border-[#00FF66] text-black shadow-[0_0_8px_#00FF66]'
                      : 'bg-black/60 border-neutral-700 text-neutral-500'
                  }`}
                >
                  AD #{num}
                </div>
              ))}
            </div>

            <button
              onClick={handleWatchAd}
              disabled={adPlaying || frenzyActive}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{adPlaying ? 'VERIFYING S2S CRYPTOGRAPHIC TOKEN...' : frenzyActive ? '30-MIN AD FRENZY UNLOCKED' : 'WATCH 1 SHORT AD (+5 MAKI COINS)'}</span>
            </button>

            <div className="text-[11px] text-[#00FF66]/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>S2S Token Validator: Anti-memory-patch ad lock prevents memory editor bypasses.</span>
            </div>
          </div>

          {/* Decentralized LoRA Marketplace (Features 217–218) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3 font-mono text-xs">
            <span className="font-bold text-[#00FF66] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#00FF66]" /> Decentralized LoRA Style Marketplace (Features 217–218)
            </span>

            <div className="space-y-2">
              {marketplaceLoras.map((lora) => (
                <div key={lora.id} className="p-2.5 bg-black/50 rounded border border-[#00FF66]/15 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">{lora.name}</div>
                    <div className="text-[10px] text-neutral-400">Creator: {lora.creator} // 50/50 Ad Revenue Split</div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
                    {lora.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Overnight Compute-to-Earn Harvester (Features 214–216) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#00FF66] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" /> Overnight Compute-to-Earn Harvester (Features 214–216)
              </span>
              <button
                onClick={() => {
                  sound.playKeyClick('blue');
                  setHarvesterEnabled(!harvesterEnabled);
                }}
                className={`px-2 py-0.5 rounded font-bold ${
                  harvesterEnabled ? 'bg-[#00FF66] text-black' : 'bg-black/60 text-neutral-400 border border-neutral-700'
                }`}
              >
                {harvesterEnabled ? 'HARVESTING' : 'IDLE'}
              </button>
            </div>

            <p className="text-[#00FF66]/70">
              Rents out idle NPU cycles while your device is plugged in and charging overnight. In exchange, you earn Maki Coins to unlock ad-free passes and premium LoRAs without spending fiat or Bitcoin.
            </p>

            <div className="p-3 bg-black/60 rounded border border-[#00FF66]/20 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#00FF66]/60">CURRENT HARVEST STATUS:</span>
                <span className="text-emerald-300 font-bold">{harvesterStatus}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#00FF66]/60">EARNED TONIGHT:</span>
                <span className="text-amber-400 font-bold">+{earnedTokensTonight} Maki Coins</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#00FF66]/60">BATTERY THERMAL GOVERNOR:</span>
                <span className="text-white font-semibold">Capped at 39°C (Safe Overnight Charging)</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded text-emerald-300 text-[11px]">
              Active network nodes reward your compute contribution automatically via the Local Ad-Free Credit Ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
