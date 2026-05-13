// constants/templates.ts
export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  gradient: string[];
  overlay?: string;
  textStyle?: {
    color: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
  };
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:5';
  tags: string[];
}

export const TEMPLATES: Template[] = [
  // Social Media
  {
    id: 'insta-story-1',
    name: 'Story Vibes',
    category: 'Instagram Story',
    thumbnail: '',
    gradient: ['#7c3aed', '#a855f7', '#ec4899'],
    aspectRatio: '9:16',
    tags: ['instagram', 'story', 'morado'],
    filters: { brightness: 1.1, contrast: 1.05, saturation: 1.2 },
  },
  {
    id: 'insta-post-1',
    name: 'Feed Gold',
    category: 'Instagram Post',
    thumbnail: '',
    gradient: ['#f59e0b', '#ef4444', '#7c3aed'],
    aspectRatio: '1:1',
    tags: ['instagram', 'feed', 'dorado'],
    filters: { brightness: 1.0, contrast: 1.1, saturation: 1.15 },
  },
  {
    id: 'insta-post-2',
    name: 'Minimal Dark',
    category: 'Instagram Post',
    thumbnail: '',
    gradient: ['#0a0a0f', '#13131a', '#1e1e2e'],
    aspectRatio: '1:1',
    tags: ['instagram', 'minimal', 'dark'],
    filters: { brightness: 0.9, contrast: 1.2, saturation: 0.8 },
  },
  {
    id: 'tiktok-1',
    name: 'TikTok Energy',
    category: 'TikTok',
    thumbnail: '',
    gradient: ['#010101', '#ff0050', '#00f2ea'],
    aspectRatio: '9:16',
    tags: ['tiktok', 'vertical', 'viral'],
    filters: { brightness: 1.15, contrast: 1.2, saturation: 1.3 },
  },
  {
    id: 'tiktok-2',
    name: 'Neon Night',
    category: 'TikTok',
    thumbnail: '',
    gradient: ['#0d0221', '#7c3aed', '#06b6d4'],
    aspectRatio: '9:16',
    tags: ['tiktok', 'neon', 'nocturno'],
    filters: { brightness: 1.05, contrast: 1.1, saturation: 1.4 },
  },
  {
    id: 'youtube-1',
    name: 'YouTube Thumb',
    category: 'YouTube',
    thumbnail: '',
    gradient: ['#ff0000', '#1a1a1a', '#333333'],
    aspectRatio: '16:9',
    tags: ['youtube', 'thumbnail', 'rojo'],
    filters: { brightness: 1.1, contrast: 1.3, saturation: 1.2 },
  },
  {
    id: 'youtube-2',
    name: 'YT Cinematic',
    category: 'YouTube',
    thumbnail: '',
    gradient: ['#1a1a2e', '#16213e', '#0f3460'],
    aspectRatio: '16:9',
    tags: ['youtube', 'cinematic', 'azul'],
    filters: { brightness: 0.95, contrast: 1.15, saturation: 0.9 },
  },
  // Photo Filters
  {
    id: 'filter-sunset',
    name: 'Sunset Dream',
    category: 'Filtros',
    thumbnail: '',
    gradient: ['#f97316', '#ec4899', '#7c3aed'],
    aspectRatio: '1:1',
    tags: ['filtro', 'sunset', 'cálido'],
    filters: { brightness: 1.1, contrast: 1.05, saturation: 1.35 },
  },
  {
    id: 'filter-ocean',
    name: 'Ocean Cool',
    category: 'Filtros',
    thumbnail: '',
    gradient: ['#0ea5e9', '#06b6d4', '#0891b2'],
    aspectRatio: '1:1',
    tags: ['filtro', 'frío', 'azul'],
    filters: { brightness: 1.0, contrast: 1.1, saturation: 0.85 },
  },
  {
    id: 'filter-vintage',
    name: 'Vintage Film',
    category: 'Filtros',
    thumbnail: '',
    gradient: ['#92400e', '#b45309', '#d97706'],
    aspectRatio: '1:1',
    tags: ['filtro', 'vintage', 'retro'],
    filters: { brightness: 0.95, contrast: 0.9, saturation: 0.7 },
  },
  {
    id: 'filter-mono',
    name: 'Mono Classic',
    category: 'Filtros',
    thumbnail: '',
    gradient: ['#111827', '#374151', '#6b7280'],
    aspectRatio: '1:1',
    tags: ['filtro', 'blanco y negro', 'monocromo'],
    filters: { brightness: 1.0, contrast: 1.2, saturation: 0.0 },
  },
  // Business
  {
    id: 'biz-1',
    name: 'Corporate Pro',
    category: 'Negocios',
    thumbnail: '',
    gradient: ['#1e3a5f', '#2563eb', '#3b82f6'],
    aspectRatio: '16:9',
    tags: ['negocios', 'profesional', 'azul'],
    filters: { brightness: 1.0, contrast: 1.1, saturation: 1.0 },
  },
  {
    id: 'biz-2',
    name: 'Startup Vibes',
    category: 'Negocios',
    thumbnail: '',
    gradient: ['#0f172a', '#7c3aed', '#a855f7'],
    aspectRatio: '16:9',
    tags: ['negocios', 'startup', 'moderno'],
    filters: { brightness: 1.05, contrast: 1.1, saturation: 1.1 },
  },
  // Celebration
  {
    id: 'party-1',
    name: 'Fiesta Gold',
    category: 'Celebración',
    thumbnail: '',
    gradient: ['#7c2d12', '#f59e0b', '#fbbf24'],
    aspectRatio: '4:5',
    tags: ['fiesta', 'cumpleaños', 'dorado'],
    filters: { brightness: 1.1, contrast: 1.05, saturation: 1.3 },
  },
  {
    id: 'party-2',
    name: 'Galaxy Party',
    category: 'Celebración',
    thumbnail: '',
    gradient: ['#020617', '#4f46e5', '#7c3aed', '#ec4899'],
    aspectRatio: '9:16',
    tags: ['fiesta', 'galaxia', 'neón'],
    filters: { brightness: 1.05, contrast: 1.1, saturation: 1.4 },
  },
];

export const TEMPLATE_CATEGORIES = [
  'Todos',
  'Instagram Story',
  'Instagram Post',
  'TikTok',
  'YouTube',
  'Filtros',
  'Negocios',
  'Celebración',
];

export const SOUNDS = [
  { id: 'cinematic-1', name: 'Epic Intro', category: 'Cinemático', duration: '0:08', emoji: '🎬' },
  { id: 'upbeat-1', name: 'Positive Vibes', category: 'Alegre', duration: '0:15', emoji: '🎵' },
  { id: 'lofi-1', name: 'Lo-Fi Chill', category: 'Relajante', duration: '0:20', emoji: '🎶' },
  { id: 'hiphop-1', name: 'Urban Beat', category: 'Hip-Hop', duration: '0:12', emoji: '🎤' },
  { id: 'electronic-1', name: 'Tech Drop', category: 'Electrónica', duration: '0:10', emoji: '🎧' },
  { id: 'acoustic-1', name: 'Soft Guitar', category: 'Acústica', duration: '0:18', emoji: '🎸' },
  { id: 'dramatic-1', name: 'Big Moment', category: 'Dramático', duration: '0:12', emoji: '🎻' },
  { id: 'funny-1', name: 'Comedy Pop', category: 'Divertido', duration: '0:06', emoji: '😂' },
  { id: 'nature-1', name: 'Forest Rain', category: 'Naturaleza', duration: '0:30', emoji: '🌧️' },
  { id: 'retro-1', name: 'Retro Wave', category: 'Retro', duration: '0:14', emoji: '📻' },
  { id: 'inspirational-1', name: 'Rise Up', category: 'Inspiracional', duration: '0:16', emoji: '⭐' },
  { id: 'dark-1', name: 'Dark Tension', category: 'Oscuro', duration: '0:11', emoji: '🌑' },
];
