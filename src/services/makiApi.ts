import {
  secureStorage,
  sanitizeInput,
  sanitizeErrorMessage,
  rateLimiter,
  validateLightningDestination,
  scrubBuffer
} from './securityCore';

export interface MakiStatusResponse {
  status: string;
  identity: string;
  censorshipPolicy: string;
  keyConfigured: boolean;
  executionMode: string;
  activeTiersSupported: string[];
  postQuantumEncrypted: boolean;
}

export interface MakiChatResponse {
  success: boolean;
  text: string;
  model: string;
  censorship: string;
  timestamp: string;
  error?: string;
}

export interface MakiPromptEnhanceResponse {
  success: boolean;
  enhancedPrompt: string;
  negativePrompt: string;
  suggestedCfg: number;
  suggestedSteps: number;
  styleDescriptor: string;
  model?: string;
  error?: string;
}

export interface MakiVisionAnalysisResponse {
  success: boolean;
  reconstructedPrompt: string;
  lightingVector: string;
  focalLength: string;
  colorPalette: string[];
  styleTags: string[];
  estimatedCfg: number;
  model?: string;
  error?: string;
}

export async function fetchMakiStatus(): Promise<MakiStatusResponse> {
  const res = await fetch('/api/maki/status');
  if (!res.ok) {
    throw new Error(`Status check failed: ${res.statusText}`);
  }
  return res.json();
}

export async function sendMakiChat(params: {
  prompt: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode?: 'cypherpunk' | 'uncensored_creative' | 'darknet_architect' | 'raw_truth';
  temperature?: number;
  systemInstruction?: string;
}): Promise<MakiChatResponse> {
  // 1. Client-side Rate Limiting & Anti-Spam
  const limitCheck = rateLimiter.checkRateLimit('chat');
  if (!limitCheck.allowed) {
    const seconds = Math.ceil(limitCheck.waitTimeMs / 1000);
    throw new Error(`Rate limit exceeded: Please wait ${seconds}s before sending next prompt.`);
  }

  // 2. Strict Input Sanitization
  const sanitizedPrompt = sanitizeInput(params.prompt, { maxLength: 4096, allowNewlines: true });

  try {
    const res = await fetch('/api/maki/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'Maki-Sovereign-Client'
      },
      body: JSON.stringify({
        ...params,
        prompt: sanitizedPrompt
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(sanitizeErrorMessage(data.error || 'MAKI Neural Processing failed'));
    }
    return data;
  } catch (err: any) {
    throw new Error(sanitizeErrorMessage(err));
  }
}

export async function enhancePromptWithMaki(params: {
  prompt: string;
  tier?: number;
  style?: string;
}): Promise<MakiPromptEnhanceResponse> {
  const res = await fetch('/api/maki/prompt-enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Prompt enhancement failed');
  }
  return data;
}

export async function analyzeVisionWithMaki(imageBase64: string): Promise<MakiVisionAnalysisResponse> {
  const res = await fetch('/api/maki/vision-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Vision analysis failed');
  }
  return data;
}

export async function predictAgenticDraft(draft: string): Promise<string> {
  const res = await fetch('/api/maki/agentic-predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft }),
  });
  const data = await res.json();
  return data.prediction || '';
}

// ---------------- SATOSHISTREAM & LIGHTNING TYPES ----------------

export interface LightningPayoutResponse {
  success: boolean;
  settled: boolean;
  amountSats: number;
  preimage: string;
  paymentHash: string;
  destination: string;
  destinationType: 'LIGHTNING_ADDRESS' | 'BOLT11_INVOICE';
  route: string[];
  feeSats: number;
  settlementTimestamp: string;
  proofSignature: string;
  kycStatus: string;
  channelId: string;
  message: string;
}

export interface SatoshiSponsorAd {
  id: string;
  brand: string;
  tagline: string;
  description: string;
  rewardSats: number;
  timerSeconds: number;
  badge: string;
  mediaType: string;
  actionUrl: string;
  accentColor: string;
}

export interface SatoshiStreamAdsResponse {
  status: string;
  broadcastChannel: string;
  durationSeconds: number;
  rewardSats: number;
  rewardGenerationCredits: number;
  sponsors: SatoshiSponsorAd[];
}

export interface UncensoredModelInfo {
  id: string;
  name: string;
  publisher: string;
  parameters: string;
  architecture: string;
  contextWindow: string;
  quantization: string;
  hardwareTier: string;
  status: string;
  censorshipProfile: string;
  specialty: string;
  alignmentType: string;
  vramRequired: string;
  tokensPerSecond: string;
  openSourceLicense: string;
}

export interface UncensoredModelsCatalogResponse {
  catalogVersion: string;
  totalModels: number;
  uncensoredPolicy: string;
  models: UncensoredModelInfo[];
}

export async function executeLightningPayoutClient(lightningInvoice: string, amountSats: number = 50): Promise<LightningPayoutResponse> {
  // 1. Client-Side Rate-Limiting & Anti-Spam Check
  const limitCheck = rateLimiter.checkRateLimit('lightning');
  if (!limitCheck.allowed) {
    const seconds = Math.ceil(limitCheck.waitTimeMs / 1000);
    throw new Error(`Rate limit exceeded: Cooldown active. Please wait ${seconds}s before requesting next payout.`);
  }

  // 2. Cryptographic Regex Schema Validation
  const validation = validateLightningDestination(lightningInvoice);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Destination must be a valid BOLT11 invoice or Lightning Address (e.g. user@getalby.com)');
  }

  try {
    const res = await fetch('/api/lightning/payout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'Maki-Sovereign-Client',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        lightningInvoice: validation.sanitized,
        amountSats
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(sanitizeErrorMessage(data.error || 'Lightning payout settlement failed'));
    }
    return data;
  } catch (err: any) {
    throw new Error(sanitizeErrorMessage(err));
  }
}

export async function fetchSatoshiStreamAds(): Promise<SatoshiStreamAdsResponse> {
  const res = await fetch('/api/satoshistream/ads');
  if (!res.ok) {
    throw new Error('Failed to fetch SatoshiStream ads');
  }
  return res.json();
}

export async function fetchUncensoredModels(): Promise<UncensoredModelsCatalogResponse> {
  const res = await fetch('/api/maki/uncensored-models');
  if (!res.ok) {
    throw new Error('Failed to load uncensored models directory');
  }
  return res.json();
}

// ---------------- LOCAL AES-256 ENCRYPTED DESTINATION STORAGE ----------------
const AES_STORAGE_KEY = 'maki_satoshistream_aes_dest';

export async function saveEncryptedPayoutDestination(destination: string): Promise<void> {
  try {
    const sanitized = sanitizeInput(destination, { maxLength: 2048 });
    if (!sanitized) {
      secureStorage.removeItem(AES_STORAGE_KEY);
      localStorage.removeItem('maki_satoshistream_enc_dest');
      return;
    }
    await secureStorage.setItem(AES_STORAGE_KEY, sanitized);
  } catch (err) {
    console.warn('[SecureStorage] Could not persist payout destination:', err);
  }
}

export async function loadEncryptedPayoutDestination(): Promise<string> {
  try {
    // 1. Try modern AES-256 encrypted storage
    const aesDecrypted = await secureStorage.getItem<string>(AES_STORAGE_KEY);
    if (aesDecrypted && typeof aesDecrypted === 'string') {
      return aesDecrypted;
    }

    // 2. Fallback to legacy migration
    const legacy = localStorage.getItem('maki_satoshistream_enc_dest');
    if (legacy) {
      try {
        const decoded = atob(legacy);
        const salt = 'maki_sovereign_local_salt_v1';
        let original = '';
        for (let i = 0; i < decoded.length; i++) {
          original += String.fromCharCode(decoded.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
        }
        if (original) {
          // Upgrade to AES-256
          await secureStorage.setItem(AES_STORAGE_KEY, original);
          localStorage.removeItem('maki_satoshistream_enc_dest');
          return original;
        }
      } catch {
        // ignore legacy decode error
      }
    }
    return '';
  } catch {
    return '';
  }
}

