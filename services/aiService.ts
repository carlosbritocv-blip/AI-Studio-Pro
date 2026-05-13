// services/aiService.ts
import axios from 'axios';

export interface GenerateImageParams {
  prompt: string;
  apiKey: string;
  style?: 'vivid' | 'natural';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
}

export interface GenerateImageFromImageParams {
  prompt: string;
  imageBase64: string;
  apiKey: string;
}

export interface StabilityParams {
  prompt: string;
  apiKey: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfgScale?: number;
}

// ─── OpenAI DALL-E 3 ────────────────────────────────────────────
export const generateImageDallE = async (params: GenerateImageParams): Promise<string> => {
  const { prompt, apiKey, style = 'vivid', size = '1024x1024', quality = 'standard' } = params;

  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    {
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality,
      style,
      response_format: 'url',
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  return response.data.data[0].url;
};

// ─── OpenAI GPT-4V Image Understanding ────────────────────────
export const analyzeImageWithGPT = async (
  imageBase64: string,
  prompt: string,
  apiKey: string
): Promise<string> => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  return response.data.choices[0].message.content;
};

// ─── OpenAI Image Edit (Inpainting) ──────────────────────────
export const editImageWithDallE = async (
  imageBase64: string,
  prompt: string,
  apiKey: string,
  size: '256x256' | '512x512' | '1024x1024' = '1024x1024'
): Promise<string> => {
  const formData = new FormData();
  
  // Convert base64 to blob
  const byteCharacters = atob(imageBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  
  formData.append('image', blob, 'image.png');
  formData.append('prompt', prompt);
  formData.append('n', '1');
  formData.append('size', size);
  formData.append('response_format', 'url');

  const response = await axios.post(
    'https://api.openai.com/v1/images/edits',
    formData,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    }
  );

  return response.data.data[0].url;
};

// ─── Stability AI ────────────────────────────────────────────
export const generateImageStability = async (params: StabilityParams): Promise<string> => {
  const {
    prompt,
    apiKey,
    negativePrompt = '',
    width = 1024,
    height = 1024,
    steps = 30,
    cfgScale = 7,
  } = params;

  const response = await axios.post(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
      text_prompts: [
        { text: prompt, weight: 1 },
        ...(negativePrompt ? [{ text: negativePrompt, weight: -1 }] : []),
      ],
      cfg_scale: cfgScale,
      width,
      height,
      steps,
      samples: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 90000,
    }
  );

  const base64Image = response.data.artifacts[0].base64;
  return `data:image/png;base64,${base64Image}`;
};

// ─── OpenAI Caption / Describe ────────────────────────────────
export const generateCaption = async (
  imageBase64: string,
  tone: string,
  apiKey: string
): Promise<string> => {
  const tonePrompts: Record<string, string> = {
    professional: 'Escribe un caption profesional y corporativo para esta imagen. Incluye hashtags relevantes.',
    casual: 'Escribe un caption casual y amigable para esta imagen. Usa emojis y hashtags.',
    funny: 'Escribe un caption gracioso y con humor para esta imagen. Usa emojis divertidos.',
    inspirational: 'Escribe un caption inspiracional y motivador para esta imagen. Usa citas o frases poderosas.',
    tiktok: 'Escribe un caption viral estilo TikTok para esta imagen. Corto, impactante, con hashtags trending.',
  };

  const systemPrompt = tonePrompts[tone] || tonePrompts.casual;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en redes sociales y marketing digital. ${systemPrompt} Responde SOLO con el caption, sin explicaciones.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: 'Genera el caption para esta imagen.',
            },
          ],
        },
      ],
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  return response.data.choices[0].message.content;
};

// ─── Prompt Enhancer ─────────────────────────────────────────
export const enhancePrompt = async (
  originalPrompt: string,
  apiKey: string,
  type: 'image' | 'video' = 'image'
): Promise<string> => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en prompts para generación de ${type === 'image' ? 'imágenes con IA (DALL-E, Stable Diffusion)' : 'vídeos con IA'}. 
          Mejora el prompt del usuario para hacerlo más detallado, descriptivo y efectivo.
          Añade: estilo artístico, iluminación, composición, calidad y detalles técnicos.
          Responde SOLO con el prompt mejorado en inglés, sin explicaciones.`,
        },
        {
          role: 'user',
          content: originalPrompt,
        },
      ],
      max_tokens: 200,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  );

  return response.data.choices[0].message.content;
};
