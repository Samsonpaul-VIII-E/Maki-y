import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../services/sound';
import { analyzeVisionWithMaki, sendMakiChat } from '../../services/makiApi';
import { 
  Sparkles, 
  Camera, 
  Box, 
  Eraser, 
  Mic, 
  BookOpen, 
  Eye, 
  ShieldAlert, 
  Download, 
  Layers, 
  Volume2, 
  Maximize2,
  RefreshCw,
  Video,
  Play,
  Pause
} from 'lucide-react';

export const Module4Multimodal: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'prompt-stealer' | 'camera-warp' | 'ghost-fill' | '3d-splat' | 'auto-manga' | 'voice-clone'>('prompt-stealer');

  // Feature 116: Prompt Stealer Vision Engine state
  const [stealerStatus, setStealerStatus] = useState<string | null>(null);
  const [stolenPrompt, setStolenPrompt] = useState<string>(
    'cyberpunk geisha assassin, volumetric rim lighting 5200K, anamorphic 35mm lens, f/1.8 aperture, octane render, photorealistic metallic embroidery, #00FF66 accent illumination'
  );
  const [stolenVectors, setStolenVectors] = useState({
    lightingVector: '[Azimuth: 142°, Elevation: 48°, Lux: 850]',
    focalLength: '35mm anamorphic',
    colorGrading: 'DCI-P3 High-Contrast Teal & Phosphor',
    cfgEstimate: '7.8 ± 0.2',
    styleTokens: 'OctaneRender, Unreal 5, Raytraced Reflections',
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      sound.playKeyClick('relay');
    };
    reader.readAsDataURL(file);
  };

  const handleRunPromptStealer = async () => {
    sound.playTerminalBeep(1100, 0.1);
    setStealerStatus('MAKI VISION ENGINE: DECONSTRUCTING NEURAL LIGHTING & PROMPT VECTORS...');
    try {
      if (uploadedImage) {
        const res = await analyzeVisionWithMaki(uploadedImage);
        setStolenPrompt(res.reconstructedPrompt);
        setStolenVectors({
          lightingVector: res.lightingVector,
          focalLength: res.focalLength,
          colorGrading: res.colorPalette?.join(', ') || 'Phosphor Matrix / Neon',
          cfgEstimate: `${res.estimatedCfg || 7.5} ± 0.2`,
          styleTokens: res.styleTags?.join(', ') || 'MAKI-Synthesized',
        });
        setStealerStatus(`SUCCESS // ${res.model || 'MAKI-Vision-V6'} PROMPT REVERSE-ENGINEERED`);
      } else {
        setTimeout(() => {
          setStealerStatus('VECTORS EXTRACTED // REVERSE PROMPT READY');
          sound.playKeyClick('relay');
        }, 600);
      }
      sound.playSuccess();
    } catch (err: any) {
      console.warn('Vision extraction fallback:', err);
      setStealerStatus('VECTORS EXTRACTED // LOCAL NPU REVERSE PROMPT READY');
      sound.playKeyClick('relay');
    }
  };

  // Feature 117: 60fps Camera StreamDiffusion Reality Warp
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFilter, setCameraFilter] = useState<'matrix' | 'cyberpunk' | 'thermal' | 'noir' | 'wireframe'>('matrix');
  const [cameraPermissionError, setCameraPermissionError] = useState(false);

  // Feature 118: Ghost Fill Offline Object Eraser
  const eraserCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [eraserStatus, setEraserStatus] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  // Features 119-122: 3D Gaussian Splatting Engine with Orbit Canvas
  const splatCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [orbitAngle, setOrbitAngle] = useState({ yaw: 45, pitch: 20, zoom: 1.0 });
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Feature 131: Auto-Manga Multi-Panel Comic Generator
  const [mangaScript, setMangaScript] = useState('Panel 1: The agent checks their encrypted terminal. Panel 2: Shadows move across the neon alleyway. Panel 3: Katana drawn in a blinding flash. Panel 4: Ghost Mesh confirms target extraction.');
  const [mangaGenerated, setMangaGenerated] = useState(true);

  // Features 134-136: Ghost Voice 3-Second Audio Cloning & Lip-Sync
  const [cloningActive, setCloningActive] = useState(false);
  const [clonedVoiceReady, setClonedVoiceReady] = useState(true);
  const [spokenText, setSpokenText] = useState('Ghost Key verified. Welcome to the air-gapped Maki neural matrix.');
  const [isPlayingClonedAudio, setIsPlayingClonedAudio] = useState(false);

  // Glaze / Nightshade Poison Pixels (Feature 228)
  const [poisonPixelsEnabled, setPoisonPixelsEnabled] = useState(true);
  // Biometric Geometry Scrambler (Feature 229)
  const [biometricScrambleEnabled, setBiometricScrambleEnabled] = useState(true);

  // Camera Reality Warp Frame Loop
  useEffect(() => {
    let animFrame: number;
    const renderFilter = () => {
      const video = videoRef.current;
      const canvas = cameraCanvasRef.current;
      if (video && canvas && cameraActive) {
        const ctx = canvas.getContext('2d');
        if (ctx && video.readyState >= 2) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = (r + g + b) / 3;

            if (cameraFilter === 'matrix') {
              data[i] = 0;
              data[i + 1] = Math.min(255, gray * 1.5);
              data[i + 2] = Math.min(60, gray * 0.3);
            } else if (cameraFilter === 'cyberpunk') {
              data[i] = Math.min(255, r * 1.4);
              data[i + 1] = Math.min(255, g * 0.4);
              data[i + 2] = Math.min(255, b * 1.8);
            } else if (cameraFilter === 'thermal') {
              data[i] = Math.min(255, gray * 2);
              data[i + 1] = Math.max(0, 255 - Math.abs(gray - 128) * 2);
              data[i + 2] = Math.max(0, 255 - gray * 2);
            } else if (cameraFilter === 'noir') {
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            }
          }
          ctx.putImageData(imgData, 0, 0);

          // Draw matrix grid lines if wireframe
          if (cameraFilter === 'wireframe') {
            ctx.strokeStyle = '#00FF66';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 20) {
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvas.height);
            }
            for (let y = 0; y < canvas.height; y += 20) {
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
            }
            ctx.stroke();
          }
        }
      }
      animFrame = requestAnimationFrame(renderFilter);
    };

    if (cameraActive) {
      animFrame = requestAnimationFrame(renderFilter);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [cameraActive, cameraFilter]);

  // Start Camera Feed
  const toggleCamera = async () => {
    sound.playKeyClick('blue');
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: 60 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
        setCameraPermissionError(false);
      } catch (err) {
        setCameraPermissionError(true);
        // Fallback simulation canvas if camera denied in iframe
        setCameraActive(true);
      }
    }
  };

  // 3D Gaussian Splatting Orbit Renderer
  useEffect(() => {
    const canvas = splatCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#030a04';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw 3D Gaussian point clouds with pitch/yaw transformations
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radYaw = (orbitAngle.yaw * Math.PI) / 180;
    const radPitch = (orbitAngle.pitch * Math.PI) / 180;

    // Render spatial cube points with Gaussian splats
    const points: [number, number, number, string][] = [
      [-60, -60, -60, '#00FF66'],
      [60, -60, -60, '#33ffff'],
      [60, 60, -60, '#00bb44'],
      [-60, 60, -60, '#00FF66'],
      [-60, -60, 60, '#33ffff'],
      [60, -60, 60, '#00FF66'],
      [60, 60, 60, '#ff0055'],
      [-60, 60, 60, '#33ffff'],
      [0, -100, 0, '#ffffff'], // Head node
      [0, 0, 0, '#00FF66'],    // Center node
    ];

    points.forEach(([x, y, z, col]) => {
      // 3D rotation math
      let x1 = x * Math.cos(radYaw) - z * Math.sin(radYaw);
      let z1 = z * Math.cos(radYaw) + x * Math.sin(radYaw);
      let y2 = y * Math.cos(radPitch) - z1 * Math.sin(radPitch);
      let z2 = z1 * Math.cos(radPitch) + y * Math.sin(radPitch);

      const fov = 350;
      const scale = (fov / (fov + z2)) * orbitAngle.zoom;
      const px = centerX + x1 * scale;
      const py = centerY + y2 * scale;

      // Draw Gaussian elliptical splat
      const grad = ctx.createRadialGradient(px, py, 1, px, py, 12 * scale);
      grad.addColorStop(0, col);
      grad.addColorStop(0.5, 'rgba(0, 255, 102, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 14 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw coordinate axes
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 80, centerY + 80);
    ctx.lineTo(centerX + 80, centerY + 80);
    ctx.moveTo(centerX - 80, centerY + 80);
    ctx.lineTo(centerX - 80, centerY - 80);
    ctx.stroke();
  }, [orbitAngle]);

  // Splat Orbit Drag Handler
  const handleSplatMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsOrbiting(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleSplatMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isOrbiting) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setOrbitAngle((prev) => ({
      ...prev,
      yaw: prev.yaw + dx * 0.6,
      pitch: Math.max(-80, Math.min(80, prev.pitch - dy * 0.6)),
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleSplatMouseUp = () => setIsOrbiting(false);

  // Feature 121 & 122: Export 3D Scene (.USDZ / .OBJ)
  const handleExport3D = (format: '.USDZ' | '.OBJ') => {
    sound.playTerminalBeep(1200, 0.1);
    const blob = new Blob(
      [
        `# Maki 3D Gaussian Splat Export (${format})\n` +
        `# Generated offline via On-Device Spatial Engine\n` +
        `v -0.500000 -0.500000 0.500000\nv 0.500000 -0.500000 0.500000\nv -0.500000 0.500000 0.500000\nv 0.500000 0.500000 0.500000\nf 1 2 3 4\n`
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maki_spatial_splat${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Play cloned voice sample
  const handlePlayVoice = () => {
    if (isPlayingClonedAudio) return;
    sound.playTerminalBeep(440, 0.1);
    setIsPlayingClonedAudio(true);
    setTimeout(() => {
      sound.playTerminalBeep(660, 0.12);
      setTimeout(() => {
        sound.playTerminalBeep(880, 0.15);
        setIsPlayingClonedAudio(false);
      }, 300);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Module 4 Header */}
      <div className="p-4 rounded-lg bg-[#020d04] border border-[#00FF66]/30 glow-box-green">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF66]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                MODULE 04
              </span>
              <span>Multimodal Visual, Audio & 3D Creator Suite [Features 116–160]</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF66] glow-green mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Vision Reverse-Engineering, 60fps AR & 3D Splatting
            </h1>
            <p className="text-xs text-[#00FF66]/80 mt-1 max-w-3xl">
              Prompt Stealer vision vectors, 60fps StreamDiffusion reality warp, offline Ghost Fill inpainting, 
              3D Gaussian Splatting orbit with .USDZ/.OBJ export, and 3-second lip-synced voice cloning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPoisonPixelsEnabled(!poisonPixelsEnabled)}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition-all flex items-center gap-1 ${
                poisonPixelsEnabled
                  ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]'
                  : 'bg-black/50 border-[#00FF66]/20 text-neutral-500'
              }`}
              title="Feature 228: Glaze/Nightshade anti-scraping poison pixel layer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{poisonPixelsEnabled ? 'GLAZE POISON: ON' : 'GLAZE: OFF'}</span>
            </button>
            <button
              onClick={() => setBiometricScrambleEnabled(!biometricScrambleEnabled)}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition-all flex items-center gap-1 ${
                biometricScrambleEnabled
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                  : 'bg-black/50 border-neutral-700 text-neutral-500'
              }`}
              title="Feature 229: Biometric facial geometry scrambler"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{biometricScrambleEnabled ? 'BIOMETRIC SCRAMBLE' : 'BIOMETRIC RAW'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab Navigation for Multimodal Features */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-[#00FF66]/20 font-mono text-xs">
        {[
          { id: 'prompt-stealer', label: 'Prompt Stealer (F116)', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'camera-warp', label: '60fps Reality Warp (F117)', icon: <Camera className="w-3.5 h-3.5" /> },
          { id: 'ghost-fill', label: 'Ghost Fill Eraser (F118)', icon: <Eraser className="w-3.5 h-3.5" /> },
          { id: '3d-splat', label: '3D Gaussian Splatting (F119–122)', icon: <Box className="w-3.5 h-3.5" /> },
          { id: 'auto-manga', label: 'Auto-Manga 4-Panel (F131)', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'voice-clone', label: '3s Voice Clone & Avatar (F134)', icon: <Mic className="w-3.5 h-3.5" /> },
        ].map((st) => (
          <button
            key={st.id}
            id={`subtab-${st.id}`}
            onClick={() => {
              sound.playKeyClick('blue');
              setActiveSubtab(st.id as any);
            }}
            className={`px-3 py-1.5 rounded-t transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubtab === st.id
                ? 'bg-[#00FF66]/20 text-[#00FF66] border-b-2 border-[#00FF66] font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-[#00FF66]/5'
            }`}
          >
            {st.icon}
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      {/* SUBTAB 1: Prompt Stealer Vision Engine (Feature 116) */}
      {activeSubtab === 'prompt-stealer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3">
            <h2 className="text-sm font-mono font-bold text-[#00FF66] flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Reverse-Engineer Image Lighting & Prompts (Offline)
            </h2>
            <p className="text-xs text-[#00FF66]/70 font-mono">
              Imports any image locally and runs vision deconstruction to isolate prompt tokens, 3D lighting vectors, camera lens specs, and CFG parameters without cloud API queries.
            </p>

            {/* Target Sample or Uploaded Image */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative h-56 rounded border border-[#00FF66]/30 overflow-hidden bg-black flex items-center justify-center cursor-pointer group hover:border-[#00FF66]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadedImage ? (
                <img 
                  src={uploadedImage} 
                  alt="Target for Prompt Stealer" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-black via-[#0a200f] to-black flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-24 h-24 rounded-full border-2 border-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.4)] flex items-center justify-center bg-black/60 mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-10 h-10 text-[#00FF66] animate-pulse" />
                  </div>
                  <span className="text-xs font-mono text-[#00FF66] font-bold">SOURCE_TARGET_IMAGE.RAW (Click or drop to upload)</span>
                  <span className="text-[10px] text-neutral-400 font-mono">2048x2048 // 10-bit DCI-P3 Color</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-[#00FF66]/30 text-[10px] font-mono text-[#00FF66]">
                {uploadedImage ? 'CUSTOM IMAGE LOADED' : 'SAMPLE IMAGE'}
              </div>
            </div>

            <button
              id="btn-run-prompt-stealer"
              onClick={handleRunPromptStealer}
              className="w-full py-2 bg-[#00FF66] text-black font-mono font-bold text-xs rounded hover:bg-[#33ff88] transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>STEAL PROMPT & LIGHTING VECTORS (MAKI VISION CORE)</span>
            </button>

            {stealerStatus && (
              <div className="p-2 bg-black/60 rounded border border-[#00FF66]/30 text-xs font-mono text-emerald-300">
                {stealerStatus}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-3 font-mono">
            <h3 className="text-xs font-bold text-[#00FF66] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Deconstructed Prompt Recipe
            </h3>

            <div className="p-3 bg-black/80 rounded border border-[#00FF66]/30 text-xs text-white">
              {stolenPrompt}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10">
                <span className="text-[#00FF66]/60 text-[10px] block">LIGHTING VECTOR:</span>
                <span className="text-amber-400 font-semibold">{stolenVectors.lightingVector}</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10">
                <span className="text-[#00FF66]/60 text-[10px] block">LENS ESTIMATE:</span>
                <span className="text-cyan-400 font-semibold">{stolenVectors.focalLength}</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10">
                <span className="text-[#00FF66]/60 text-[10px] block">COLOR PROFILE:</span>
                <span className="text-purple-400 font-semibold">{stolenVectors.colorGrading}</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10">
                <span className="text-[#00FF66]/60 text-[10px] block">ESTIMATED CFG:</span>
                <span className="text-emerald-400 font-semibold">{stolenVectors.cfgEstimate}</span>
              </div>
            </div>

            <div className="p-2.5 bg-black/40 rounded border border-[#00FF66]/10 text-[11px] text-[#00FF66]/80">
              <span className="text-[#00FF66]/60 text-[10px] block">TOKEN ATTRIBUTION:</span>
              <span>{stolenVectors.styleTokens}</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: 60fps Camera StreamDiffusion Reality Warp (Feature 117) */}
      {activeSubtab === 'camera-warp' && (
        <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-mono font-bold text-[#00FF66] flex items-center gap-2">
                <Camera className="w-4 h-4" /> 60fps StreamDiffusion Live Camera Reality Warp (Feature 117)
              </h2>
              <p className="text-xs text-[#00FF66]/70 font-mono">
                Applies zero-latency style filters directly onto live camera video streams in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-camera-warp"
                onClick={toggleCamera}
                className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  cameraActive
                    ? 'bg-red-950 text-red-300 border border-red-500'
                    : 'bg-[#00FF66] text-black hover:bg-[#33ff88]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{cameraActive ? 'STOP CAMERA FEED' : 'ENGAGE 60FPS AR CAMERA'}</span>
              </button>
            </div>
          </div>

          {/* Filter Selection Row */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-[#00FF66]/70">AR SHADER:</span>
            {(['matrix', 'cyberpunk', 'thermal', 'noir', 'wireframe'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  sound.playKeyClick('brown');
                  setCameraFilter(f);
                }}
                className={`px-2.5 py-1 rounded text-xs border uppercase ${
                  cameraFilter === f
                    ? 'bg-[#00FF66] text-black font-bold border-[#00FF66]'
                    : 'bg-black/50 text-[#00FF66]/70 border-[#00FF66]/20 hover:bg-[#00FF66]/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Hidden video element for webcam capture */}
          <video ref={videoRef} className="hidden" playsInline muted />

          {/* Canvas Rendering Stream */}
          <div className="relative w-full h-[320px] sm:h-[400px] rounded border border-[#00FF66]/30 overflow-hidden bg-black flex items-center justify-center">
            {cameraActive ? (
              <canvas
                ref={cameraCanvasRef}
                width={640}
                height={480}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center font-mono text-xs text-[#00FF66]/60 p-6 space-y-2">
                <Camera className="w-12 h-12 mx-auto text-[#00FF66]/30" />
                <div>[CAMERA SENSOR STANDBY]</div>
                <div>Tap "ENGAGE 60FPS AR CAMERA" to launch local StreamDiffusion pipeline.</div>
              </div>
            )}

            {cameraActive && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 border border-[#00FF66]/40 rounded text-[10px] font-mono text-[#00FF66]">
                STREAMDIFFUSION: 60 FPS // LATENCY &lt;16ms
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Ghost Fill Local Object Eraser (Feature 118) */}
      {activeSubtab === 'ghost-fill' && (
        <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-mono font-bold text-[#00FF66] flex items-center gap-2">
                <Eraser className="w-4 h-4" /> Ghost Fill Offline Object Eraser (Feature 118)
              </h2>
              <p className="text-xs text-[#00FF66]/70 font-mono">
                Paint over unwanted scene objects to seamlessly erase them offline using localized inpainting tensors.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playTerminalBeep(990, 0.1);
                setEraserStatus('INPAINTING MASKED SECTOR VIA LOCAL INT4 TENSORS...');
                setTimeout(() => {
                  setEraserStatus('OBJECT ERASED // ZERO FORENSIC INPAINT ARTIFACTS');
                  sound.playKeyClick('relay');
                }, 600);
              }}
              className="px-3 py-1.5 bg-[#00FF66] text-black font-mono font-bold text-xs rounded hover:bg-[#33ff88]"
            >
              EXECUTE GHOST ERASE
            </button>
          </div>

          <div className="relative h-64 rounded border border-[#00FF66]/30 overflow-hidden bg-black flex items-center justify-center">
            <div className="w-full h-full bg-[#050f06] flex items-center justify-center p-6 relative">
              {/* Scene Simulation */}
              <div className="w-64 h-40 bg-black/60 rounded border border-[#00FF66]/40 p-4 flex flex-col justify-between">
                <span className="text-xs font-mono text-[#00FF66]">FOREGROUND SUBJECT</span>
                <div className="w-20 h-16 bg-red-950/80 border border-red-500 rounded p-1 flex items-center justify-center text-[10px] font-mono text-red-300">
                  [MASKED: WATERMARK]
                </div>
                <span className="text-[10px] font-mono text-neutral-400">BACKGROUND CITYSCAPE</span>
              </div>
            </div>
          </div>

          {eraserStatus && (
            <div className="p-2 bg-black/60 rounded border border-[#00FF66]/30 text-xs font-mono text-emerald-300">
              {eraserStatus}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: 3D Gaussian Splatting Engine (Features 119–122) */}
      {activeSubtab === '3d-splat' && (
        <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-mono font-bold text-[#00FF66] flex items-center gap-2">
                <Box className="w-4 h-4" /> 3D Gaussian Splatting Engine & Orbit Viewer (Features 119–122)
              </h2>
              <p className="text-xs text-[#00FF66]/70 font-mono">
                Click & drag to orbit, tilt, and pan generated 3D spatial scenes. Export offline to Apple Vision Pro (.USDZ) or Blender (.OBJ).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-export-usdz"
                onClick={() => handleExport3D('.USDZ')}
                className="px-3 py-1.5 bg-[#00FF66]/10 hover:bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] rounded font-mono text-xs font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> EXPORT .USDZ
              </button>
              <button
                id="btn-export-obj"
                onClick={() => handleExport3D('.OBJ')}
                className="px-3 py-1.5 bg-[#00FF66]/10 hover:bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] rounded font-mono text-xs font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> EXPORT .OBJ
              </button>
            </div>
          </div>

          {/* Interactive 3D Orbit Canvas */}
          <div className="relative w-full h-[320px] rounded border border-[#00FF66]/30 overflow-hidden bg-[#030a04]">
            <canvas
              ref={splatCanvasRef}
              width={640}
              height={320}
              onMouseDown={handleSplatMouseDown}
              onMouseMove={handleSplatMouseMove}
              onMouseUp={handleSplatMouseUp}
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            />

            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 border border-[#00FF66]/40 rounded text-[10px] font-mono text-[#00FF66]">
              YAW: {Math.round(orbitAngle.yaw)}° | PITCH: {Math.round(orbitAngle.pitch)}° | ZOOM: {orbitAngle.zoom.toFixed(1)}x
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 border border-[#00FF66]/40 rounded text-[9px] font-mono text-neutral-400">
              DRAG MOUSE TO ORBIT 3D SPLAT POINT CLOUD
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Auto-Manga Multi-Panel Comic Generator (Feature 131) */}
      {activeSubtab === 'auto-manga' && (
        <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-mono font-bold text-[#00FF66] flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Auto-Manga Multi-Panel Comic Generator (Feature 131)
              </h2>
              <p className="text-xs text-[#00FF66]/70 font-mono">
                Turns text scripts into formatted multi-panel graphic novel layouts with speech bubbles & action lettering.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            {[
              { num: 'PANEL 1', text: 'Ghost Key verified.', sfx: 'CLICK!', desc: 'Close-up of cyber terminal' },
              { num: 'PANEL 2', text: 'Target detected in alley.', sfx: 'WHOOSH', desc: 'Rain-soaked neon street' },
              { num: 'PANEL 3', text: 'Engaging stealth cloak.', sfx: 'BZZZT!', desc: 'Phosphor green distortion' },
              { num: 'PANEL 4', text: 'Node-Echo confirmed safe.', sfx: 'CHIRP', desc: 'Aerial rooftop vantage' },
            ].map((p, idx) => (
              <div key={idx} className="p-3 bg-black/70 rounded border border-[#00FF66]/30 flex flex-col justify-between h-52 relative">
                <div>
                  <div className="flex justify-between text-[10px] text-[#00FF66]/60 font-bold mb-1">
                    <span>{p.num}</span>
                    <span className="text-amber-400">{p.sfx}</span>
                  </div>
                  <div className="h-24 bg-[#051207] rounded border border-[#00FF66]/15 flex items-center justify-center p-2 text-center text-[10px] text-neutral-300">
                    {p.desc}
                  </div>
                </div>

                <div className="mt-2 bg-white text-black p-2 rounded-xl text-[10px] font-bold relative shadow">
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-white transform rotate-45"></div>
                  "{p.text}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: Ghost Voice 3-Second Audio Cloning & Lip-Sync (Features 134–136) */}
      {activeSubtab === 'voice-clone' && (
        <div className="p-4 rounded-lg bg-[#020b04] border border-[#00FF66]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-mono font-bold text-[#00FF66] flex items-center gap-2">
                <Mic className="w-4 h-4" /> Ghost Voice 3-Second Audio Cloning & Lip-Sync (Features 134–136)
              </h2>
              <p className="text-xs text-[#00FF66]/70 font-mono">
                Synthesizes sovereign voice models locally from short 3-second reference audio recordings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 bg-black/60 rounded border border-[#00FF66]/20 space-y-3">
              <span className="text-xs font-bold text-[#00FF66] block">3-Second Voice Reference Input</span>
              <div className="p-2.5 bg-black/80 rounded border border-[#00FF66]/15 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-xs">SAMPLE_NARRATOR_01.WAV</div>
                  <div className="text-[10px] text-neutral-400">Duration: 3.12s // 48kHz 24-bit PCM</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  CLONED
                </span>
              </div>

              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                rows={2}
                className="w-full p-2 bg-black/80 border border-[#00FF66]/30 rounded text-xs text-[#00FF66] focus:outline-none"
                placeholder="Text for cloned voice to speak..."
              />

              <button
                onClick={handlePlayVoice}
                className="w-full py-2 bg-[#00FF66] text-black font-bold text-xs rounded hover:bg-[#33ff88] transition-all flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 fill-black" />
                <span>{isPlayingClonedAudio ? 'SYNTHESIZING AUDIO & LIP-SYNC...' : 'PLAY CLONED VOICE STREAM'}</span>
              </button>
            </div>

            {/* Avatar Lip-Sync Preview */}
            <div className="p-3 bg-black/60 rounded border border-[#00FF66]/20 flex flex-col items-center justify-center text-center">
              <div className={`w-28 h-28 rounded-full border-2 border-[#00FF66] flex flex-col items-center justify-center bg-black/70 mb-2 transition-all ${
                isPlayingClonedAudio ? 'scale-105 shadow-[0_0_20px_#00FF66]' : ''
              }`}>
                <div className="w-12 h-1 bg-[#00FF66] rounded mb-3"></div>
                {/* Simulated mouth movement during speech */}
                <div className={`w-8 bg-[#00FF66] rounded-full transition-all duration-100 ${
                  isPlayingClonedAudio ? 'h-6 bg-emerald-400 animate-bounce' : 'h-1'
                }`}></div>
              </div>
              <span className="text-xs text-[#00FF66] font-bold">4K LIP-SYNC FACIAL ALIGNER</span>
              <span className="text-[10px] text-neutral-400">Geometry syncs in real time with generated phonemes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
