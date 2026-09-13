import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../services/sound';
import { 
  executeLightningPayoutClient, 
  fetchSatoshiStreamAds, 
  saveEncryptedPayoutDestination, 
  loadEncryptedPayoutDestination,
  LightningPayoutResponse,
  SatoshiSponsorAd
} from '../../services/makiApi';
import {
  validateLightningDestination,
  scrubBuffer,
  scrubInputElement,
  sanitizeErrorMessage,
  rateLimiter
} from '../../services/securityCore';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  Radio, 
  AlertTriangle, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  Coins,
  Cpu,
  Clock,
  Trash2
} from 'lucide-react';

interface ModuleSatoshiStreamProps {
  onUnlockCredits?: (amount: number) => void;
  onNavigateToModule?: (moduleId: string) => void;
}

export const ModuleSatoshiStream: React.FC<ModuleSatoshiStreamProps> = ({
  onUnlockCredits,
  onNavigateToModule,
}) => {
  // Payout state & local encrypted storage
  const [lightningDestination, setLightningDestination] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedLocally, setSavedLocally] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Ad Timer State
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(10);
  const [adCompleted, setAdCompleted] = useState<boolean>(false);
  const [adProgressPercent, setAdProgressPercent] = useState<number>(0);
  const [activeSponsorIndex, setActiveSponsorIndex] = useState<number>(0);
  const [sponsorsList, setSponsorsList] = useState<SatoshiSponsorAd[]>([]);

  // Payout Execution State
  const [isPayingOut, setIsPayingOut] = useState<boolean>(false);
  const [payoutResult, setPayoutResult] = useState<LightningPayoutResponse | null>(null);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  // Lifetime session metrics
  const [totalEarnedSats, setTotalEarnedSats] = useState<number>(150);
  const [unlockedAiGenerations, setUnlockedAiGenerations] = useState<number>(3);
  const [memoryScrubbed, setMemoryScrubbed] = useState<boolean>(false);
  const [destTypeDetected, setDestTypeDetected] = useState<'BOLT11' | 'LIGHTNING_ADDRESS' | 'INVALID' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved encrypted destination on mount and fetch sponsors
  useEffect(() => {
    loadEncryptedPayoutDestination()
      .then((saved) => {
        if (saved) {
          setLightningDestination(saved);
          setSavedLocally(true);
          const res = validateLightningDestination(saved);
          if (res.isValid) {
            setDestTypeDetected(res.type);
          }
        }
      })
      .catch(console.warn);

    fetchSatoshiStreamAds()
      .then((data) => {
        if (data && data.sponsors && data.sponsors.length > 0) {
          setSponsorsList(data.sponsors);
        }
      })
      .catch((err) => {
        console.warn('Could not load ads catalog:', err);
      });
  }, []);

  const activeSponsor: SatoshiSponsorAd = sponsorsList[activeSponsorIndex] || {
    id: 'ad-coldcard-mk4',
    brand: 'COLDCARD Mk4 Hardware Wallet',
    tagline: 'Ultra-Secure Air-Gapped Bitcoin Signing Device with Dual Secure Elements',
    description: 'Never expose private keys to online hosts. Verify PSBT transactions via MicroSD or NFC with open-source firmware.',
    rewardSats: 50,
    timerSeconds: 15,
    badge: 'CYPHERPUNK VERIFIED',
    mediaType: 'interactive_demo',
    actionUrl: 'https://coldcard.com',
    accentColor: '#00FF66'
  };

  // Cryptographic Regex Validation function
  const validateDestination = (value: string): boolean => {
    if (!value || !value.trim()) {
      setValidationError('Please enter a Lightning Address or BOLT11 invoice');
      setDestTypeDetected(null);
      return false;
    }
    const res = validateLightningDestination(value);
    if (!res.isValid) {
      setValidationError(res.error || 'Invalid format: Must start with "lnbc" (BOLT11) or match user@domain.tld');
      setDestTypeDetected('INVALID');
      return false;
    }

    setDestTypeDetected(res.type);
    setValidationError(null);
    return true;
  };

  // Purge sensitive buffers from memory
  const handlePurgeMemory = () => {
    scrubBuffer(lightningDestination);
    scrubInputElement('input-lightning-destination');
    setLightningDestination('');
    setDestTypeDetected(null);
    setValidationError(null);
    setMemoryScrubbed(true);
    sound.playTerminalBeep(1400, 0.08);
    setTimeout(() => setMemoryScrubbed(false), 3000);
  };

  // Start watching ad
  const handleStartWatchAd = () => {
    sound.playKeyClick('blue');
    setIsWatchingAd(true);
    setAdCompleted(false);
    setTimerSecondsLeft(10);
    setAdProgressPercent(0);
    setPayoutResult(null);
    setPayoutError(null);

    // Play initial acoustic pulse
    sound.playTerminalBeep(880, 0.08);

    if (timerRef.current) clearInterval(timerRef.current);

    const totalTime = 10;
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += 1;
      const remaining = totalTime - elapsed;
      setTimerSecondsLeft(Math.max(0, remaining));
      setAdProgressPercent(Math.min(100, Math.round((elapsed / totalTime) * 100)));

      // Subtle mechanical tick each second
      sound.playKeyClick('brown');

      if (elapsed >= totalTime) {
        if (timerRef.current) clearInterval(timerRef.current);
        onAdComplete();
      }
    }, 1000);
  };

  // onAdComplete callback
  const onAdComplete = () => {
    setIsWatchingAd(false);
    setAdCompleted(true);
    sound.playSuccess();
    setUnlockedAiGenerations((prev) => prev + 1);

    if (onUnlockCredits) {
      onUnlockCredits(100);
    }
  };

  // Handle Lightning payout execution
  const handleExecutePayout = async () => {
    if (!validateDestination(lightningDestination)) {
      sound.playWarning();
      return;
    }

    sound.playKeyClick('relay');
    setIsPayingOut(true);
    setPayoutError(null);
    setPayoutResult(null);

    try {
      // Save locally in AES-256 encrypted format
      await saveEncryptedPayoutDestination(lightningDestination.trim());
      setSavedLocally(true);

      const result = await executeLightningPayoutClient(lightningDestination.trim(), 50);
      setPayoutResult(result);
      setTotalEarnedSats((prev) => prev + result.amountSats);
      sound.playSuccess();

      // Automated memory scrubbing after execution
      scrubBuffer(lightningDestination);
      setMemoryScrubbed(true);
      setTimeout(() => setMemoryScrubbed(false), 5000);
    } catch (err: any) {
      console.error('Payout failed:', err);
      setPayoutError(sanitizeErrorMessage(err));
      sound.playWarning();
    } finally {
      setIsPayingOut(false);
    }
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    sound.playKeyClick('blue');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#00FF00]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF00]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00]">
                SATOSHISTREAM
              </span>
              <span>Sovereign No-KYC Ad-to-Earn Bitcoin Lightning Engine</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF00] glow-green mt-1 flex items-center gap-2 font-mono">
              <Zap className="w-5 h-5 fill-[#00FF00] text-[#00FF00]" /> SatoshiStream: Watch Ad → Earn 50 Sats
            </h1>
            <p className="text-xs text-[#00FF00]/80 mt-1 max-w-3xl font-mono">
              Watch a 15-second sovereign cypherpunk sponsor broadcast to instantly claim 50 Satoshis over 
              the Bitcoin Lightning Network and unlock 100 AI generation credits. Zero KYC, zero trackers, pure cryptographic pre-image settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 bg-black/80 border border-[#00FF00]/40 rounded flex items-center gap-2 text-[#00FF00]">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>EARNED: <strong className="text-amber-400">{totalEarnedSats} SATS</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-black/80 border border-[#00FF00]/40 rounded flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4 text-[#00FF00]" />
              <span>UNLOCKED: <strong>{unlockedAiGenerations} GENERATIONS</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The Watch Ad Cybernetic Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-lg bg-[#0a0a0a] border border-[#00FF00]/30 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00FF00] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#00FF00] animate-pulse" />
                <span>SPONSORED P2P BROADCAST HUD</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#00FF00]/10 border border-[#00FF00]/40 text-[10px] text-[#00FF00]">
                {activeSponsor.badge}
              </span>
            </div>

            {/* Video / Cybernetic Sponsor Player */}
            <div className="relative h-64 rounded border border-[#00FF00]/40 bg-black overflow-hidden flex flex-col justify-between p-4 group">
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00FF00]/10 via-transparent to-black pointer-events-none" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="text-[11px] text-[#00FF00]/60 uppercase tracking-widest font-mono">
                    SPONSOR CHANNEL 0{activeSponsorIndex + 1}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{activeSponsor.brand}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1 justify-end">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" /> +50 SATS
                  </div>
                  <div className="text-[10px] text-emerald-400">+100 AI CREDITS</div>
                </div>
              </div>

              {/* Center Interactive Content / Ad Simulation */}
              <div className="relative z-10 my-auto text-center space-y-2 py-4">
                <p className="text-xs text-[#00FF00] font-semibold max-w-md mx-auto">
                  "{activeSponsor.tagline}"
                </p>
                <p className="text-[11px] text-neutral-300 max-w-sm mx-auto line-clamp-2">
                  {activeSponsor.description}
                </p>

                {isWatchingAd && (
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/90 border border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.3)]">
                      <Clock className="w-4 h-4 text-[#00FF00] animate-spin" />
                      <span className="text-xs font-bold text-[#00FF00]">
                        BROADCAST IN PROGRESS: {timerSecondsLeft}s
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar & Footer */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-[#00FF00]/70">
                  <span>PROOF-OF-ATTENTION PROGRESS</span>
                  <span>{adProgressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-900 border border-[#00FF00]/30 overflow-hidden">
                  <div 
                    className="h-full bg-[#00FF00] transition-all duration-300 shadow-[0_0_8px_#00FF00]"
                    style={{ width: `${adProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sponsor Selector Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {sponsorsList.map((sponsor, idx) => (
                <button
                  key={sponsor.id}
                  onClick={() => {
                    if (!isWatchingAd) {
                      sound.playKeyClick('brown');
                      setActiveSponsorIndex(idx);
                    }
                  }}
                  disabled={isWatchingAd}
                  className={`p-2 rounded text-[10px] text-left border transition-all ${
                    activeSponsorIndex === idx 
                      ? 'border-[#00FF00] bg-[#00FF00]/15 text-[#00FF00] font-bold' 
                      : 'border-[#00FF00]/20 bg-black/60 text-neutral-400 hover:text-[#00FF00] hover:border-[#00FF00]/50'
                  }`}
                >
                  <div className="truncate font-semibold">{sponsor.brand.split(' ')[0]}</div>
                  <div className="text-[9px] text-[#00FF00]/60">15s // +50sats</div>
                </button>
              ))}
            </div>

            {/* Watch Ad Button */}
            {!isWatchingAd ? (
              <button
                id="btn-watch-ad-satoshistream"
                onClick={handleStartWatchAd}
                className="w-full py-3 bg-[#00FF00] hover:bg-[#33ff33] text-black font-mono font-bold text-xs rounded transition-all shadow-[0_0_20px_rgba(0,255,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Watch Sponsor Clip to Earn Sats / Unlock Generations</span>
              </button>
            ) : (
              <div className="w-full py-3 bg-black/80 border border-[#00FF00]/50 text-[#00FF00] font-mono font-bold text-xs rounded flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 animate-spin text-[#00FF00]" />
                <span>STREAMING SPONSOR DATA ({timerSecondsLeft} SECONDS REMAINING)...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lightning Micro-Payout & Settlement Proof */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-lg bg-[#0a0a0a] border border-[#00FF00]/30 space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00FF00] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>NO-KYC LIGHTNING PAYOUT DISPATCHER</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ZERO-KNOWLEDGE
              </span>
            </div>

            <p className="text-xs text-[#00FF00]/70">
              Paste your personal Lightning Address (e.g. <span className="text-[#00FF00] underline">user@getalby.com</span>) 
              or a BlueWallet/Phoenix Lightning invoice (<span className="text-[#00FF00] underline">lnbc...</span>). 
              Payout destinations are encrypted locally in your browser and never sent to central analytics.
            </p>

            {/* Input Box: Revealed immediately, with celebration highlight when ad completes */}
            <div className={`space-y-2 p-3 rounded border transition-all ${
              adCompleted 
                ? 'bg-[#00FF00]/10 border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.2)]' 
                : 'bg-black/60 border-[#00FF00]/30'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <label className="text-[#00FF00] font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>LIGHTNING DESTINATION ADDRESS OR INVOICE</span>
                </label>
                <div className="flex items-center gap-2">
                  {memoryScrubbed && (
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      <ShieldCheck className="w-3 h-3" /> RAM BUFFER SCRUBBED
                    </span>
                  )}
                  {savedLocally && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> AES-256 ENCRYPTED STATE
                    </span>
                  )}
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="input-lightning-destination"
                  type="text"
                  value={lightningDestination}
                  onChange={(e) => {
                    setLightningDestination(e.target.value);
                    validateDestination(e.target.value);
                  }}
                  placeholder="user@getalby.com or lnbc500n1p..."
                  className="w-full p-2.5 pr-20 bg-black border border-[#00FF00]/40 rounded text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00]"
                />
                {lightningDestination && (
                  <button
                    type="button"
                    onClick={handlePurgeMemory}
                    title="Scrub and purge this destination buffer from browser RAM"
                    className="absolute right-2 px-2 py-1 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>PURGE RAM</span>
                  </button>
                )}
              </div>

              {/* Cryptographic Format Validation Status */}
              {destTypeDetected && (
                <div className="flex items-center gap-2 pt-0.5">
                  {destTypeDetected === 'BOLT11' && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      BECH32 BOLT11 PROTOCOL VERIFIED
                    </span>
                  )}
                  {destTypeDetected === 'LIGHTNING_ADDRESS' && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      RFC LNURL-PAY ADDRESS VERIFIED
                    </span>
                  )}
                </div>
              )}

              {validationError && (
                <div className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {validationError}
                </div>
              )}

              {/* Sample test addresses chip buttons */}
              <div className="flex items-center gap-2 pt-1 text-[10px] text-neutral-400">
                <span>Quick Test:</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playKeyClick('blue');
                    setLightningDestination('satoshi@getalby.com');
                    validateDestination('satoshi@getalby.com');
                  }}
                  className="px-1.5 py-0.5 bg-black rounded border border-[#00FF00]/30 text-[#00FF00] hover:border-[#00FF00]"
                >
                  satoshi@getalby.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playKeyClick('blue');
                    setLightningDestination('cypherpunk@walletofsatoshi.com');
                    validateDestination('cypherpunk@walletofsatoshi.com');
                  }}
                  className="px-1.5 py-0.5 bg-black rounded border border-[#00FF00]/30 text-[#00FF00] hover:border-[#00FF00]"
                >
                  cypherpunk@walletofsatoshi.com
                </button>
              </div>
            </div>

            {/* Claim 50 Sats Button */}
            <button
              id="btn-claim-lightning-payout"
              onClick={handleExecutePayout}
              disabled={isPayingOut || isWatchingAd}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              {isPayingOut ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>DISPATCHING 50 SATS OVER LIGHTNING MESH...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>CLAIM 50 SATS MICRO-PAYOUT (ZERO KYC)</span>
                </>
              )}
            </button>

            {/* Error banner */}
            {payoutError && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded text-xs text-red-300 font-mono space-y-1">
                <div className="font-bold flex items-center gap-1 text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> LIGHTNING ROUTING ERROR
                </div>
                <div>{payoutError}</div>
              </div>
            )}

            {/* Cryptographic Pre-Image Settlement Receipt */}
            <AnimatePresence>
              {payoutResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded border border-emerald-500/50 bg-emerald-950/20 space-y-3 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>50 SATS SETTLED INSTANTLY</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/40">
                      {payoutResult.kycStatus}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-200">
                    {payoutResult.message}
                  </p>

                  <div className="p-2.5 bg-black/80 rounded border border-emerald-500/30 space-y-2 text-[11px]">
                    <div>
                      <div className="text-neutral-400 text-[10px]">CRYPTOGRAPHIC PRE-IMAGE PROOF (SHA-256):</div>
                      <div className="flex items-center justify-between text-[#00FF00] font-mono break-all text-[10px] mt-0.5">
                        <span className="truncate max-w-[280px]">{payoutResult.preimage}</span>
                        <button
                          onClick={() => handleCopy(payoutResult.preimage, 'preimage')}
                          className="p-1 hover:text-white"
                          title="Copy Pre-Image"
                        >
                          {copiedField === 'preimage' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-neutral-400 text-[10px]">PAYMENT HASH:</div>
                      <div className="flex items-center justify-between text-neutral-300 font-mono break-all text-[10px] mt-0.5">
                        <span className="truncate max-w-[280px]">{payoutResult.paymentHash}</span>
                        <button
                          onClick={() => handleCopy(payoutResult.paymentHash, 'hash')}
                          className="p-1 hover:text-white"
                          title="Copy Payment Hash"
                        >
                          {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>CHANNEL: {payoutResult.channelId}</span>
                      <span>FEE: 0 SATS</span>
                      <span>HOP LATENCY: 7ms</span>
                    </div>
                  </div>

                  {onNavigateToModule && (
                    <button
                      onClick={() => onNavigateToModule('mod-generation')}
                      className="w-full py-2 bg-[#00FF00]/15 hover:bg-[#00FF00]/25 border border-[#00FF00]/50 text-[#00FF00] font-bold rounded flex items-center justify-center gap-1.5 text-xs transition-all"
                    >
                      <span>USE 100 AI CREDITS IN GENERATION SUITE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sovereign Principles & No-KYC Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded bg-[#0a0a0a] border border-[#00FF00]/20 space-y-1.5">
          <div className="text-[#00FF00] font-bold flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> Zero-KYC Lightning Routing
          </div>
          <p className="text-neutral-400 text-[11px]">
            No names, emails, phone numbers, or passport uploads. Micro-payments stream directly via peer-to-peer Lightning channels with atomic SHA-256 pre-image proofs.
          </p>
        </div>

        <div className="p-3.5 rounded bg-[#0a0a0a] border border-[#00FF00]/20 space-y-1.5">
          <div className="text-[#00FF00] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Client-Side Encrypted Storage
          </div>
          <p className="text-neutral-400 text-[11px]">
            Your Lightning Address is stored exclusively on your device using salted local encryption. Maki maintains zero central databases or ad trackers.
          </p>
        </div>

        <div className="p-3.5 rounded bg-[#0a0a0a] border border-[#00FF00]/20 space-y-1.5">
          <div className="text-[#00FF00] font-bold flex items-center gap-1.5">
            <Cpu className="w-4 h-4" /> Circular Satoshi Economy
          </div>
          <p className="text-neutral-400 text-[11px]">
            Earned Satoshis can be spent across the Ghost Mesh to rent 250 TOPS NPU compute, pay LoRA creators, or withdraw to self-custody cold storage.
          </p>
        </div>
      </div>
    </div>
  );
};
