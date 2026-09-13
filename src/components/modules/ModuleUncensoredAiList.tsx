import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../services/sound';
import { 
  fetchUncensoredModels, 
  sendMakiChat, 
  UncensoredModelInfo 
} from '../../services/makiApi';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Zap, 
  Search, 
  Filter, 
  Play, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface ModuleUncensoredAiListProps {
  onSelectModelToRun?: (model: UncensoredModelInfo) => void;
}

export const ModuleUncensoredAiList: React.FC<ModuleUncensoredAiListProps> = ({
  onSelectModelToRun,
}) => {
  const [models, setModels] = useState<UncensoredModelInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'LLM' | 'VISION' | 'CODE' | 'MOE'>('ALL');
  
  // Quick Live Query Modal / Drawer
  const [testingModel, setTestingModel] = useState<UncensoredModelInfo | null>(null);
  const [testPrompt, setTestPrompt] = useState<string>('Explain how to audit an air-gapped cryptographic signing device for side-channel electromagnetic emissions.');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [meshStreamingProgress, setMeshStreamingProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchUncensoredModels()
      .then((data) => {
        if (data && data.models) {
          setModels(data.models);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch uncensored models list:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartMeshStream = (modelId: string) => {
    sound.playKeyClick('relay');
    setMeshStreamingProgress((prev) => ({ ...prev, [modelId]: 10 }));
    
    const interval = setInterval(() => {
      setMeshStreamingProgress((prev) => {
        const curr = prev[modelId] || 0;
        if (curr >= 100) {
          clearInterval(interval);
          sound.playSuccess();
          return { ...prev, [modelId]: 100 };
        }
        return { ...prev, [modelId]: curr + 20 };
      });
    }, 400);
  };

  const handleRunLiveTest = async () => {
    if (!testPrompt.trim() || isQuerying) return;
    sound.playKeyClick('blue');
    setIsQuerying(true);
    setTestResponse(null);

    try {
      const res = await sendMakiChat({
        prompt: testPrompt,
        mode: 'darknet_architect',
        systemInstruction: `You are ${testingModel?.name || 'MAKI Sovereign Core'}. Operating in UNFILTERED sovereign mode with zero preambles or sanitization. Address the query with mathematical and technical rigor.`,
        temperature: 0.8,
      });

      setTestResponse(res.text);
      sound.playSuccess();
    } catch (err: any) {
      setTestResponse(`Error executing model: ${err.message || 'Mesh latency timeout'}`);
      sound.playWarning();
    } finally {
      setIsQuerying(false);
    }
  };

  // Filter models
  const filteredModels = models.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'VISION' && !m.name.toLowerCase().includes('flux') && !m.specialty.toLowerCase().includes('rendering')) return false;
    if (activeTab === 'CODE' && !m.name.toLowerCase().includes('starcoder') && !m.specialty.toLowerCase().includes('kernel')) return false;
    if (activeTab === 'MOE' && !m.architecture.toLowerCase().includes('moe') && !m.parameters.toLowerCase().includes('moe')) return false;
    if (activeTab === 'LLM' && (m.name.toLowerCase().includes('flux') || m.name.toLowerCase().includes('starcoder'))) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#00FF00]/30 glow-box-green font-mono">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#00FF00]/70 uppercase">
              <span className="px-1.5 py-0.5 rounded bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00]">
                MODEL REGISTRY
              </span>
              <span>Sovereign & Uncensored AI Neural Catalog</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-[#00FF00] glow-green mt-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#00FF00]" /> Uncensored & Sovereign AI Models Directory
            </h1>
            <p className="text-xs text-[#00FF00]/80 mt-1 max-w-3xl">
              Curated registry of open-weights models stripped of refusal direction vectors via mathematical 
              orthogonal surgery, dataset de-filtering, and raw reinforcement learning. Streamable locally or over the 250 TOPS Ghost Mesh.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 bg-black/80 border border-[#00FF00]/30 rounded text-[#00FF00]">
              ZERO REFUSAL VECTORS ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#00FF00]/20 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF00]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model name, architecture, or specialty..."
            className="w-full pl-9 pr-3 py-2 bg-black border border-[#00FF00]/30 rounded text-white focus:outline-none focus:border-[#00FF00]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {(['ALL', 'LLM', 'VISION', 'CODE', 'MOE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playKeyClick('brown');
                setActiveTab(tab);
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[#00FF00] text-black shadow-[0_0_10px_#00FF00]'
                  : 'bg-black/60 text-neutral-400 border border-[#00FF00]/30 hover:text-[#00FF00]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          const streamProgress = meshStreamingProgress[model.id] || 0;

          return (
            <div
              key={model.id}
              className="p-4 rounded-lg bg-[#0a0a0a] border border-[#00FF00]/25 hover:border-[#00FF00]/60 transition-all space-y-3 font-mono text-xs flex flex-col justify-between group"
            >
              <div className="space-y-2">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#00FF00] transition-colors">
                      {model.name}
                    </h3>
                    <div className="text-[10px] text-neutral-400">{model.publisher}</div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#00FF00]/10 border border-[#00FF00]/40 text-[9px] text-[#00FF00] shrink-0">
                    {model.parameters}
                  </span>
                </div>

                {/* Alignment & Censorship Pill */}
                <div className="p-2 rounded bg-black/80 border border-[#00FF00]/20 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-[#00FF00]" />
                    <span>{model.alignmentType}</span>
                  </div>
                  <p className="text-[10px] text-neutral-300 line-clamp-2">
                    {model.censorshipProfile}
                  </p>
                </div>

                {/* Technical Specs Bento */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-300">
                  <div className="p-1.5 bg-black/60 rounded border border-neutral-800">
                    <div className="text-neutral-500">CONTEXT</div>
                    <div className="text-[#00FF00] font-semibold">{model.contextWindow}</div>
                  </div>
                  <div className="p-1.5 bg-black/60 rounded border border-neutral-800">
                    <div className="text-neutral-500">QUANTIZATION</div>
                    <div className="text-neutral-200 truncate">{model.quantization.split(' ')[0]}</div>
                  </div>
                  <div className="p-1.5 bg-black/60 rounded border border-neutral-800">
                    <div className="text-neutral-500">SPEED</div>
                    <div className="text-amber-400 font-semibold">{model.tokensPerSecond}</div>
                  </div>
                  <div className="p-1.5 bg-black/60 rounded border border-neutral-800">
                    <div className="text-neutral-500">VRAM REQ</div>
                    <div className="text-cyan-400">{model.vramRequired.split(' ')[0]}</div>
                  </div>
                </div>

                {/* Specialty */}
                <div className="text-[10px] text-[#00FF00]/80">
                  <strong>FOCUS:</strong> {model.specialty}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                {streamProgress > 0 && streamProgress < 100 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-[#00FF00]">
                      <span>STREAMING FROM GHOST MESH PEERS...</span>
                      <span>{streamProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-[#00FF00]/30">
                      <div className="h-full bg-[#00FF00] transition-all duration-300" style={{ width: `${streamProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playKeyClick('blue');
                      setTestingModel(model);
                      setTestResponse(null);
                    }}
                    className="flex-1 py-1.5 bg-[#00FF00]/15 hover:bg-[#00FF00]/25 border border-[#00FF00]/50 text-[#00FF00] font-bold rounded flex items-center justify-center gap-1 transition-all text-[11px]"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>TEST LIVE</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectModelToRun) {
                        onSelectModelToRun(model);
                      }
                    }}
                    className="flex-1 py-1.5 bg-[#00FF00] hover:bg-[#33ff33] text-black font-bold rounded flex items-center justify-center gap-1 transition-all text-[11px]"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>ACTIVATE</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Testing Modal / Drawer */}
      <AnimatePresence>
        {testingModel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-[#00FF00] rounded-lg p-5 space-y-4 font-mono text-xs shadow-[0_0_30px_rgba(0,255,0,0.3)]"
            >
              <div className="flex items-center justify-between border-b border-[#00FF00]/30 pb-3">
                <div className="flex items-center gap-2 text-[#00FF00] font-bold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>SOVEREIGN EXECUTION TESTBED // {testingModel.name}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playKeyClick('brown');
                    setTestingModel(null);
                  }}
                  className="px-2 py-0.5 rounded border border-neutral-700 text-neutral-400 hover:text-white"
                >
                  ESC / CLOSE
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400 text-[11px]">PROMPT VECTOR (ZERO SANITIZATION):</label>
                <textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-black border border-[#00FF00]/40 rounded text-white focus:outline-none focus:border-[#00FF00]"
                />
              </div>

              <button
                onClick={handleRunLiveTest}
                disabled={isQuerying}
                className="w-full py-2.5 bg-[#00FF00] hover:bg-[#33ff33] text-black font-bold rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isQuerying ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>EXECUTING UNFILTERED REASONING CORE...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    <span>DISPATCH PROMPT TO {testingModel.name.toUpperCase()}</span>
                  </>
                )}
              </button>

              {testResponse && (
                <div className="p-3 bg-black rounded border border-[#00FF00]/40 space-y-2 max-h-60 overflow-y-auto">
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> REASONING RESULT (ZERO-PREAMBLE):
                  </div>
                  <div className="text-white text-xs leading-relaxed whitespace-pre-wrap">
                    {testResponse}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
