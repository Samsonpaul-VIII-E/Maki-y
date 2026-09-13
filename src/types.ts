export enum ExecutionTier {
  TIER_1 = 'TIER_1', // 650MB–800MB INT4 for 4GB budget devices
  TIER_2 = 'TIER_2', // 1GB–2GB INT4 for 6GB–8GB mid-tier phones
  TIER_3 = 'TIER_3', // 5GB–7GB INT4 + 1.5B local LLM for 12GB+ flagships
  TIER_4 = 'TIER_4', // 8GB–9GB FP16 for entry laptops
  TIER_5 = 'TIER_5', // 10GB–12GB INT8 + audio-diffusion for desktop studios
  TIER_6 = 'TIER_6', // 20GB+ FP16 unquantized FLUX models for 64GB+ workstations
}

export interface HardwareProfile {
  socName: string;
  npuTops: number;
  unifiedRamGb: number;
  storageAvailableGb: number;
  batteryLevel: number;
  isCharging: boolean;
  coreTempC: number;
  assignedTier: ExecutionTier;
  recommendedModel: string;
  ramUsageMb: number;
  vramUsageMb: number;
  quantizationMode: 'INT4' | 'INT8' | 'FP16' | 'UNQUANTIZED';
}

export interface MeshNode {
  id: string;
  name: string;
  deviceType: 'Phone' | 'Tablet' | 'Laptop' | 'Desktop Workstation' | 'Rig';
  npuTops: number;
  batteryPct: number;
  latencyMs: number;
  status: 'active' | 'syncing' | 'idle' | 'offloaded';
  role: 'Coordinator' | 'Worker Shard' | 'VRAM Host' | 'Splinter Custodian';
  ipOrBle: string;
  shardsHeld: number[];
}

export interface SplinterShard {
  index: number;
  hash: string;
  nodeHolder: string;
  status: 'secured' | 'synced' | 'pending';
  payloadPiece: string;
}

export interface QuantumManifest {
  manifestId: string;
  fileSizeBytes: number;
  chunkCount: number;
  manifestSizeKb: number; // 1KB
  sha3Hash: string;
  encryptionMode: string;
  transferSpeedGbps: number;
  transferDurationSec: number;
}

export interface GenerationSettings {
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfgScale: number;
  aspectRatio: string;
  loras: Array<{ id: string; name: string; weight: number; category: string }>;
  controlNet: {
    type: 'canny' | 'depth' | 'pose' | 'tile';
    weight: number;
    enabled: boolean;
  };
  useQuantizedInt4: boolean;
  activeTier: number;
}

export interface BitcoinTransaction {
  txid: string;
  type: 'Lightning Invoice' | 'On-Chain Taproot' | 'BIP 352 Silent' | 'BIP 78 PayJoin' | 'WabiSabi CoinJoin';
  amountSats: number;
  timestamp: string;
  status: 'settled' | 'confirming' | 'mixing';
  anonymitySet: number;
}

export interface MakiFeature {
  id: number;
  module: number;
  moduleName: string;
  name: string;
  mechanism: string;
  benefit: string;
  status: 'ONLINE' | 'ACTIVE' | 'ACCELERATED' | 'STANDBY';
}

export type ActiveModuleTab = 
  | 'public-terminal'   // Maki Sovereign Public Cyberpunk Terminal (Pollinations AI + Gemini Chat + SatoshiStream)
  | 'engine'            // Module 1
  | 'maki-uncensored'   // MAKI Sovereign Core (Uncensored Terminal)
  | 'satoshistream'     // SatoshiStream: No-KYC Ad-to-Earn Bitcoin Lightning
  | 'uncensored-models' // Uncensored AI Directory & Models Hub
  | 'quantum-mesh'      // Module 2
  | 'zero-knowledge'    // Module 3
  | 'multimodal'        // Module 4
  | 'cypherpunk-btc'    // Module 5
  | 'agentic'           // Module 6
  | 'monetization'      // Module 7
  | 'post-quantum'      // Module 8
  | 'feature-suite';    // 236 Feature Inspector
