import { ExecutionTier, HardwareProfile } from '../types';

export function profileHostHardware(): HardwareProfile {
  let memoryGb = 8;
  if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
    memoryGb = (navigator as unknown as { deviceMemory: number }).deviceMemory || 8;
  }

  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;

  // Derive realistic host metrics
  let npuTops = 14;
  let socName = 'Apple M-Series Neural Engine / Snapdragon NPU';
  let tier = ExecutionTier.TIER_3;
  let recommendedModel = 'FLUX.1 Schnell INT4 + Maki 1.5B Draft LLM (5.4GB)';
  let quant: 'INT4' | 'INT8' | 'FP16' | 'UNQUANTIZED' = 'INT4';

  if (memoryGb <= 4 || cores <= 4) {
    tier = ExecutionTier.TIER_1;
    socName = 'ARM Cortex-A55 / MediaTek Helio (4x Core)';
    npuTops = 6.2;
    recommendedModel = 'MobileDiffusion SD-1.5 INT4 (680MB)';
    quant = 'INT4';
  } else if (memoryGb <= 6) {
    tier = ExecutionTier.TIER_2;
    socName = 'Snapdragon 7-Gen / Apple A15 Bionic';
    npuTops = 18.5;
    recommendedModel = 'SDXL Turbo INT4 (1.4GB)';
    quant = 'INT4';
  } else if (memoryGb <= 12) {
    tier = ExecutionTier.TIER_3;
    socName = 'Snapdragon 8 Gen 3 / Apple A17 Pro (Hexagon/ANE)';
    npuTops = 45.0;
    recommendedModel = 'FLUX.1 Schnell INT4 + Maki 1.5B LLM (5.8GB)';
    quant = 'INT4';
  } else if (memoryGb <= 16) {
    tier = ExecutionTier.TIER_4;
    socName = 'Apple M2 / Intel Core Ultra NPU / AMD Ryzen AI';
    npuTops = 38.0;
    recommendedModel = 'SDXL Base FP16 + ControlNet Suite (8.4GB)';
    quant = 'FP16';
  } else if (memoryGb <= 32) {
    tier = ExecutionTier.TIER_5;
    socName = 'Apple M3 Max / NVIDIA RTX 4080 (Tensor Cores)';
    npuTops = 120.0;
    recommendedModel = 'FLUX.1 Kontext INT8 + Audio-Diffusion (11.2GB)';
    quant = 'INT8';
  } else {
    tier = ExecutionTier.TIER_6;
    socName = 'NVIDIA RTX 4090 / GH200 Grace Hopper (Workstation)';
    npuTops = 280.0;
    recommendedModel = 'FLUX.1 Pro Unquantized FP16 (22.8GB)';
    quant = 'UNQUANTIZED';
  }

  return {
    socName,
    npuTops,
    unifiedRamGb: memoryGb,
    storageAvailableGb: 84.6,
    batteryLevel: 91,
    isCharging: true,
    coreTempC: 38.4,
    assignedTier: tier,
    recommendedModel,
    ramUsageMb: 820,
    vramUsageMb: 1450,
    quantizationMode: quant,
  };
}

export const TIER_CONFIGS: Record<ExecutionTier, {
  name: string;
  badge: string;
  weightSize: string;
  targetHardware: string;
  defaultQuant: 'INT4' | 'INT8' | 'FP16' | 'UNQUANTIZED';
  description: string;
}> = {
  [ExecutionTier.TIER_1]: {
    name: 'Tier 1 — Micro INT4',
    badge: '650MB–800MB',
    weightSize: '720 MB',
    targetHardware: 'Budget 4GB Devices',
    defaultQuant: 'INT4',
    description: 'Ultra-quantized MobileDiffusion & SD 1.5 weights optimized for 4GB low-power devices with sub-second single-step latent inference.',
  },
  [ExecutionTier.TIER_2]: {
    name: 'Tier 2 — Mobile INT4',
    badge: '1GB–2GB',
    weightSize: '1.4 GB',
    targetHardware: '6GB–8GB Mid-Tier Phones',
    defaultQuant: 'INT4',
    description: 'SDXL Turbo / Lightning INT4 weights running via ExecuTorch / Hexagon NPU pipeline with 4-step consistency.',
  },
  [ExecutionTier.TIER_3]: {
    name: 'Tier 3 — Flagship Hybrid',
    badge: '5GB–7GB',
    weightSize: '5.8 GB',
    targetHardware: '12GB+ Flagship Phones',
    defaultQuant: 'INT4',
    description: 'FLUX.1 Schnell INT4 + Maki 1.5B speculative draft LLM with dual-thread asynchronous execution and ANE/DirectML binding.',
  },
  [ExecutionTier.TIER_4]: {
    name: 'Tier 4 — Laptop Studio',
    badge: '8GB–9GB',
    weightSize: '8.4 GB',
    targetHardware: 'Entry Laptops (16GB RAM)',
    defaultQuant: 'FP16',
    description: 'SDXL Base in native FP16 precision stacked with ControlNet (Pose, Canny, Depth) and FlashAttention-2 tiling.',
  },
  [ExecutionTier.TIER_5]: {
    name: 'Tier 5 — Desktop Pro',
    badge: '10GB–12GB',
    weightSize: '11.2 GB',
    targetHardware: 'Desktop Studios (32GB RAM)',
    defaultQuant: 'INT8',
    description: 'FLUX.1 Kontext INT8 paired with 15MB local Audio-Diffusion soundscape model and 4-LoRA concurrent blending.',
  },
  [ExecutionTier.TIER_6]: {
    name: 'Tier 6 — Workstation Beast',
    badge: '20GB+ FP16',
    weightSize: '22.8 GB',
    targetHardware: '64GB+ Workstation / Multi-GPU',
    defaultQuant: 'UNQUANTIZED',
    description: 'Full unquantized FLUX.1 Pro FP16 tensor weights with zero-disk RAM decryption stream and 250 TOPS distributed capability.',
  },
};
