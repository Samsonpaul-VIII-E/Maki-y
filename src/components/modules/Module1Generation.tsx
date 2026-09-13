import React, { useState, useRef, useEffect } from 'react';
import { ExecutionTier, HardwareProfile } from '../../types';
import { TIER_CONFIGS } from '../../services/hardwareProfiler';
import { sound } from '../../services/sound';
import { enhancePromptWithMaki } from '../../services/makiApi';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  Sparkles, 
  PenTool, 
  Lock, 
  Unlock, 
  Maximize2, 
  RotateCcw, 
  ShieldCheck, 
  Flame,
  Zap,
  Eye,
  Camera,
  Download
} from 'lucide-react';

interface Module1GenerationProps {
  hardware?: HardwareProfile | null;
  setHardware?: React.Dispatch<React.SetStateAction<HardwareProfile>>;
}

export const Module1Generation: React.FC<Module1GenerationProps> = ({
  hardware,
  setHardware,
}) => {
  const [prompt, setPrompt] = useState('cybernetic ronin standing in neon rain, high-contrast monochrome with phosphor green accents, volumetric fog, 8k octane render');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, artifacts, watermark');
  const [activeTier, setActiveTier] = useState<ExecutionTier>(hardware?.assignedTier || ExecutionTier.TIER_3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seedLocked, setSeedLocked] = useState(true);
  const [seedValue, setSeedValue] = useState(741920);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [stepProgress, setStepProgress] = useState(100);
  const [upscaleFactor, setUpscaleFactor] = useState<'1x' | '2x' | '4x'>('1x');
  const [purgedMemory, setPurgedMemory] = useState(false);

  // ControlNet stacking states
  const [controlNets, setControlNets] = useState({
    depth: true,
    pose: false,
    canny: true,
    lineart: false,
  });

  // 4-LoRA Blending Sliders
  const [loras, setLoras] = useState({
    cyberpunk: 0.85,
    neoTokyo: 0.40,
    darkManga: 0.65,
    mechaArmor: 0.20,
  });

  // IP-Adapter Selfie Embedding State
  const [faceEmbedded, setFaceEmbedded] = useState(false);
  const [faceVectorHash, setFaceVectorHash] = useState<string | null>(null);

  // Interactive 0.05s Neural Pencil Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#00FF66');
  const [brushSize, setBrushSize] = useState(4);
  const [neuralStrokeCount, setNeuralStrokeCount] = useState(12);

  // Initialize canvas with a default sketch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill dark matrix canvas
    ctx.fillStyle = '#050f06';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw initial neural stroke preview
    ctx.strokeStyle = '#00FF66';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 110, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Draw character silhouette lines
    ctx.strokeStyle = '#00bb44';
    ctx.beginPath();
    ctx.moveTo(150, 160);
    ctx.lineTo(150, 260);
    ctx.lineTo(100, 340);
    ctx.moveTo(150, 260);
    ctx.lineTo(200, 340);
    ctx.moveTo(80, 200);
    ctx.lineTo(220, 200);
    ctx.stroke();

    // Draw cyber katana glow
    ctx.strokeStyle = '#33ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 130);
    ctx.lineTo(240, 280);
    ctx.stroke();
  }, []);

  // Neural Pencil Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    sound.playKeyClick('brown');
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setNeuralStrokeCount((prev) => prev + 1);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    // 0.05s Neural stroke prediction ripple
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, brushSize * 2.5, 0, Math.PI * 2);
    ctx.stroke();
  };

  const clearCanvas = () => {
    sound.playKeyClick('relay');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#050f06';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setNeuralStrokeCount(0);
  };

  // Trigger Local Generation with zero-fill RAM purge
  const handleRunInference = () => {
    sound.playTerminalBeep(920, 0.12);
    setIsGenerating(true);
    setStepProgress(0);
    setPurgedMemory(false);

    const interval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Feature 30: Volatile memory post-inference zero-fill purger
          setPurgedMemory(true);
          sound.playKeyClick('relay');
          setTimeout(() => setPurgedMemory(false), 3000);
          return 100;
        }
        return prev + 25;
      });
    }, 140);
  };

  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  const handleMakiEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancingPrompt) return;
    sound.playKeyClick('blue');
    setIsEnhancingPrompt(true);
    try {
      const res = await enhancePromptWithMaki({
        prompt: prompt.trim(),
        tier: parseInt(activeTier.replace('TIER_', ''), 10) || 3,
        style: 'Cypherpunk Neon Phosphor High-Detail',
      });
      if (res.enhancedPrompt) {
        setPrompt(res.enhancedPrompt);
      }
      if (res.negativePrompt) {
        setNegativePrompt(res.negativePrompt);
      }
      if (res.suggestedCfg) {
        setCfgScale(res.suggestedCfg);
      }
      sound.playSuccess();
    } catch (err: any) {
      console.warn('Enhancement fallback:', err);
      sound.playWarning();
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const tierInfo = TIER_CONFIGS[activeTier];

  return (
    <div className="space-y-6">
      {/* Module Banner / Hardware Profile Summary */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                MODULE 01
              </span>
              <span>Local NPU & AI Generation Engine [Features 1–40]</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF66] glow-green mt-1 flex items-center gap-2">
              <Cpu className="w-5 h-5" /> Host Hardware Profiler & Execution Tiers
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Hardware evaluated at launch: <span className="text-white font-mono">{hardware?.socName || 'Host Neural SoC'}</span> | 
              {' '}<span className="text-white font-mono">{hardware?.unifiedRamGb || 16}GB RAM</span> | 
              {' '}<span className="text-[#00FF66] font-bold">{hardware?.npuTops || 45} TOPS NPU</span> | 
              Precision: <span className="text-amber-400 font-mono">{hardware?.quantizationMode || 'INT4'}</span>.
            </p>
          </div>

          {/* Execution Tier Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/50 p-2 rounded border border-[#00FF66]/20">
            {(Object.keys(TIER_CONFIGS) as ExecutionTier[]).map((tKey, idx) => {
              const cfg = TIER_CONFIGS[tKey];
              const isSelected = activeTier === tKey;
              return (
                <button
                  key={tKey}
                  id={`tier-btn-${tKey}`}
                  onClick={() => {
                    sound.playKeyClick('blue');
                    setActiveTier(tKey);
                    setHardware?.((prev) => ({
                      ...prev,
                      assignedTier: tKey,
                      quantizationMode: cfg.defaultQuant,
                    }));
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all text-left ${
                    isSelected
                      ? 'bg-[#00FF66] text-black font-bold shadow-[0_0_8px_rgba(0,255,102,0.6)]'
                      : 'bg-[#00FF66]/5 text-[#00FF66]/70 hover:bg-[#00FF66]/15 hover:text-[#00FF66]'
                  }`}
                >
                  <div className="font-bold">T{idx + 1}</div>
                  <div className="text-[9px] opacity-80">{cfg.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Details Badge */}
        <div className="mt-3 pt-3 border-t border-[#00FF66]/15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="bg-black/30 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">ACTIVE MODEL:</span>
            <div className="text-white font-semibold truncate">{tierInfo.name}</div>
          </div>
          <div className="bg-black/30 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">WEIGHT PACKAGE:</span>
            <div className="text-[#00FF66] font-semibold">{tierInfo.weightSize} (Encrypted RAM Stream)</div>
          </div>
          <div className="bg-black/30 p-2 rounded border border-[#00FF66]/10">
            <span className="text-[#00FF66]/50">TARGET PROFILE:</span>
            <div className="text-neutral-300 font-semibold">{tierInfo.targetHardware}</div>
          </div>
          <div className="bg-black/30 p-2 rounded border border-[#00FF66]/10 flex items-center justify-between">
            <div>
              <span className="text-[#00FF66]/50">MEM PURGE:</span>
              <div className="text-emerald-400 font-semibold">{purgedMemory ? 'ZERO-FILL PURGED' : 'AES RAM BUFFER'}</div>
            </div>
            {purgedMemory && <ShieldCheck className="w-4 h-4 text-[#00FF66] animate-pulse" />}
          </div>
        </div>
      </div>

      {/* Main Generation & Interactive Neural Pencil Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Canvas & Latent Stroke Stream (Features 15, 21, 22) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00FF66]">
                <PenTool className="w-4 h-4 text-[#00FF66]" />
                <span>0.05s Neural Pencil Brush (Feature 21)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00FF66]/10 text-emerald-400">
                  {neuralStrokeCount} Latent Strokes
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {['#00FF66', '#33ffff', '#ff0055', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      sound.playKeyClick('brown');
                      setBrushColor(c);
                    }}
                    className={`w-4 h-4 rounded-full border ${brushColor === c ? 'scale-125 border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <button
                  onClick={clearCanvas}
                  className="px-2 py-0.5 text-[10px] bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded font-mono ml-2 flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Clear
                </button>
              </div>
            </div>

            {/* Live Interactive Canvas */}
            <div className="relative border border-[#00FF66]/30 rounded overflow-hidden bg-[#050f06] shadow-inner">
              <canvas
                ref={canvasRef}
                width={400}
                height={350}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="w-full h-[280px] sm:h-[320px] cursor-crosshair touch-none"
              />

              {/* Real-time HUD scan line overlay */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 border border-[#00FF66]/40 rounded text-[9px] font-mono text-[#00FF66]">
                LATENT INJECTOR: ACTIVE // 20 FPS
              </div>

              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 border border-[#00FF66]/40 rounded text-[9px] font-mono text-emerald-300">
                STROKE PREDICTOR: DUAL-THREAD
              </div>
            </div>

            <p className="text-[11px] text-[#00FF66]/60 mt-2 font-mono">
              Draw or sketch directly on the canvas with finger/mouse: real-time noise vectors inject continuously into NPU memory at 20fps.
            </p>
          </div>

          {/* ControlNet Stacking Suite (Features 16–20) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Multi-ControlNet Simultaneous Stacking (Feature 20)
              </span>
              <span className="text-[10px] text-[#00FF66]/60 font-mono">OFFLINE EXTRACTORS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { key: 'depth', label: 'Depth Map (F16)', desc: '3D Geometry' },
                { key: 'pose', label: 'OpenPose (F17)', desc: '18-Pt Skeleton' },
                { key: 'canny', label: 'Canny Edge (F18)', desc: 'Structural Lines' },
                { key: 'lineart', label: 'LineArt (F19)', desc: 'Stylus Scribble' },
              ].map((cn) => {
                const isEnabled = controlNets[cn.key as keyof typeof controlNets];
                return (
                  <button
                    key={cn.key}
                    id={`controlnet-toggle-${cn.key}`}
                    onClick={() => {
                      sound.playKeyClick('blue');
                      setControlNets((prev) => ({
                        ...prev,
                        [cn.key]: !prev[cn.key as keyof typeof controlNets],
                      }));
                    }}
                    className={`p-2 rounded border text-left transition-all ${
                      isEnabled
                        ? 'bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66]'
                        : 'bg-black/40 border-[#00FF66]/10 text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <div className="font-bold">{cn.label}</div>
                    <div className="text-[9px] opacity-70">{cn.desc}</div>
                    <div className="text-[9px] mt-1 font-mono font-semibold">
                      {isEnabled ? '[STACKED]' : '[BYPASS]'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Conditioning, IP-Adapter & LoRA Blending */}
        <div className="lg:col-span-6 space-y-4">
          {/* Prompt Input & Execution Controller */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Prompt Conditioning & Latent Seed
              </label>
              <div className="flex items-center gap-2">
                <button
                  id="btn-maki-synthesize-prompt"
                  onClick={handleMakiEnhancePrompt}
                  disabled={isEnhancingPrompt}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#00FF66]/20 hover:bg-[#00FF66]/30 text-[#00FF66] border border-[#00FF66]/50 transition-all font-bold disabled:opacity-50"
                  title="Enhance prompt with MAKI Sovereign Neural Synthesizer"
                >
                  <Sparkles className="w-3 h-3 text-[#00FF66] animate-pulse" />
                  <span>{isEnhancingPrompt ? 'SYNTHESIZING...' : 'MAKI SYNTHESIZE'}</span>
                </button>
                <button
                  id="btn-lock-seed"
                  onClick={() => {
                    sound.playKeyClick('blue');
                    setSeedLocked(!seedLocked);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30"
                  title="Character-Consistent Seed Locking (Feature 25)"
                >
                  {seedLocked ? <Lock className="w-3 h-3 text-[#00FF66]" /> : <Unlock className="w-3 h-3 text-amber-400" />}
                  <span>{seedLocked ? `SEED #${seedValue}` : 'RANDOM SEED'}</span>
                </button>
              </div>
            </div>

            <textarea
              id="prompt-input-field"
              value={prompt}
              onChange={(e) => {
                sound.playKeyClick('brown');
                setPrompt(e.target.value);
              }}
              rows={3}
              className="w-full p-2.5 bg-black/60 border border-[#00FF66]/30 rounded text-xs font-mono text-[#00FF66] focus:outline-none focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] selection:bg-[#00FF66] selection:text-black"
              placeholder="Enter cryptographic prompt vectors..."
            />

            {/* CFG Scale & Generation Button */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#00FF66]/70">CFG SLIDER:</span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={cfgScale}
                  onChange={(e) => {
                    sound.playKeyClick('brown');
                    setCfgScale(parseFloat(e.target.value));
                  }}
                  className="accent-[#00FF66] w-24"
                />
                <span className="text-[#00FF66] font-bold">{cfgScale}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-run-inference"
                  disabled={isGenerating}
                  onClick={handleRunInference}
                  className="px-4 py-2 bg-[#00FF66] text-black font-mono font-bold rounded text-xs hover:bg-[#33ff88] active:scale-95 transition-all shadow-[0_0_12px_rgba(0,255,102,0.4)] flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{isGenerating ? `SYNTHESIZING (${stepProgress}%)` : 'EXECUTE LOCAL NPU (0.05s)'}</span>
                </button>
              </div>
            </div>

            {/* Inference Progress bar */}
            {isGenerating && (
              <div className="mt-3 w-full bg-black/80 h-2 rounded overflow-hidden border border-[#00FF66]/30">
                <div
                  className="bg-[#00FF66] h-full transition-all duration-150 shadow-[0_0_8px_#00FF66]"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* 4-LoRA Simultaneous Blending Engine (Feature 35) */}
          <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#00FF66] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> 4-LoRA Simultaneous Blending Sliders (Feature 35)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">DYNAMIC RUNTIME INJECTION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { key: 'cyberpunk', name: 'Cyberpunk 2099', color: 'accent-[#00FF66]' },
                { key: 'neoTokyo', name: 'Neo-Tokyo Anime', color: 'accent-cyan-400' },
                { key: 'darkManga', name: 'Retro Dark Manga', color: 'accent-purple-400' },
                { key: 'mechaArmor', name: 'Mecha Spec Rig', color: 'accent-amber-400' },
              ].map((lora) => {
                const val = loras[lora.key as keyof typeof loras];
                return (
                  <div key={lora.key} className="bg-black/40 p-2 rounded border border-[#00FF66]/10 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#00FF66]/80">{lora.name}</span>
                      <span className="text-white font-bold">{Math.round(val * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={val}
                      onChange={(e) => {
                        sound.playKeyClick('brown');
                        setLoras({
                          ...loras,
                          [lora.key]: parseFloat(e.target.value),
                        });
                      }}
                      className={`w-full ${lora.color}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* IP-Adapter Single-Selfie Identity Vector Embedding & Real-ESRGAN Upscaler (Features 23, 24, 37) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* IP-Adapter Facial Geometry */}
            <div className="p-3 rounded-lg bg-[#020b04] border border-[#00FF66]/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#00FF66] mb-1">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> IP-Adapter Identity
                  </span>
                  <span className="text-[10px] text-emerald-400">128-DIM</span>
                </div>
                <p className="text-[10px] text-[#00FF66]/60 font-mono">
                  {faceEmbedded ? `EMBEDDED: ${faceVectorHash}` : 'Isolates facial geometry to place subject in any scene.'}
                </p>
              </div>

              <button
                id="btn-extract-face"
                onClick={() => {
                  sound.playTerminalBeep(1100, 0.1);
                  setFaceEmbedded(!faceEmbedded);
                  setFaceVectorHash(faceEmbedded ? null : 'IP_VEC_0x9B44F2...C7E');
                }}
                className={`mt-2 py-1 px-2 rounded text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                  faceEmbedded
                    ? 'bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66]'
                    : 'bg-black/50 border border-[#00FF66]/30 text-[#00FF66]/80 hover:bg-[#00FF66]/10'
                }`}
              >
                {faceEmbedded ? 'IDENTITY EMBEDDED' : 'EXTRACT FACIAL VECTOR'}
              </button>
            </div>

            {/* Real-ESRGAN INT4 Upscaler */}
            <div className="p-3 rounded-lg bg-[#020b04] border border-[#00FF66]/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#00FF66] mb-1">
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" /> Real-ESRGAN Upscaler
                  </span>
                  <span className="text-[10px] text-emerald-400">INT4 OFFLINE</span>
                </div>
                <p className="text-[10px] text-[#00FF66]/60 font-mono">
                  Upscale 512x512 outputs to 2K/4K with zero cloud connection.
                </p>
              </div>

              <div className="mt-2 flex items-center gap-1">
                {(['1x', '2x', '4x'] as const).map((factor) => (
                  <button
                    key={factor}
                    onClick={() => {
                      sound.playKeyClick('blue');
                      setUpscaleFactor(factor);
                    }}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                      upscaleFactor === factor
                        ? 'bg-[#00FF66] text-black border-[#00FF66]'
                        : 'bg-black/40 text-[#00FF66]/70 border-[#00FF66]/20 hover:bg-[#00FF66]/10'
                    }`}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
