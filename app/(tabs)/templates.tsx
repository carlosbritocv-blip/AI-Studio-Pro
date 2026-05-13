// app/(tabs)/templates.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { TEMPLATES, TEMPLATE_CATEGORIES, SOUNDS } from '../../constants/templates';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

const TABS = ['Plantillas', 'Sonidos', 'Música'];

const MUSIC_GENRES = [
  { id: 'pop', emoji: '🎤', name: 'Pop', tracks: 24 },
  { id: 'hiphop', emoji: '🎧', name: 'Hip-Hop', tracks: 18 },
  { id: 'electronic', emoji: '🎛️', name: 'Electrónica', tracks: 31 },
  { id: 'lofi', emoji: '☕', name: 'Lo-Fi', tracks: 15 },
  { id: 'cinematic', emoji: '🎬', name: 'Cinemática', tracks: 22 },
  { id: 'acoustic', emoji: '🎸', name: 'Acústica', tracks: 19 },
  { id: 'latin', emoji: '💃', name: 'Latina', tracks: 27 },
  { id: 'ambient', emoji: '🌊', name: 'Ambiental', tracks: 13 },
  { id: 'rock', emoji: '🤘', name: 'Rock', tracks: 21 },
  { id: 'jazz', emoji: '🎷', name: 'Jazz', tracks: 16 },
  { id: 'rnb', emoji: '🎵', name: 'R&B', tracks: 20 },
  { id: 'country', emoji: '🤠', name: 'Country', tracks: 14 },
];

const SOUND_EFFECTS = [
  { id: 'whoosh', emoji: '💨', name: 'Whoosh', category: 'Transición' },
  { id: 'pop', emoji: '💥', name: 'Pop', category: 'Efecto' },
  { id: 'ding', emoji: '🔔', name: 'Ding', category: 'Notificación' },
  { id: 'swoosh', emoji: '🌀', name: 'Swoosh', category: 'Transición' },
  { id: 'click', emoji: '👆', name: 'Click', category: 'UI' },
  { id: 'boom', emoji: '💣', name: 'Boom', category: 'Impacto' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkle', category: 'Mágico' },
  { id: 'wind', emoji: '🌬️', name: 'Viento', category: 'Naturaleza' },
  { id: 'rain', emoji: '🌧️', name: 'Lluvia', category: 'Naturaleza' },
  { id: 'fire', emoji: '🔥', name: 'Fuego', category: 'Naturaleza' },
  { id: 'typing', emoji: '⌨️', name: 'Teclado', category: 'UI' },
  { id: 'camera', emoji: '📷', name: 'Cámara', category: 'UI' },
];

export default function TemplatesScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const filteredTemplates = selectedCategory === 'Todos'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    Alert.alert(
      '🎨 Plantilla seleccionada',
      'Esta plantilla se aplicará al editar tu próxima imagen. Ve al Editor de Imagen para usarla.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir al editor', onPress: () => {} },
      ]
    );
  };

  const handleSoundPreview = (id: string, name: string) => {
    if (playingSound === id) {
      setPlayingSound(null);
      Alert.alert('⏹ Detenido', `"${name}" detenido.`);
    } else {
      setPlayingSound(id);
      Alert.alert('▶ Reproduciendo', `"${name}" — Los sonidos de muestra se reproducirán cuando integres los archivos de audio en /assets/sounds/`);
      setTimeout(() => setPlayingSound(null), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎨 Recursos</Text>
        <Text style={styles.headerSubtitle}>Plantillas, sonidos y música</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── TEMPLATES ── */}
      {activeTab === 0 && (
        <View style={{ flex: 1 }}>
          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {TEMPLATE_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            contentContainerStyle={styles.templatesGrid}
            showsVerticalScrollIndicator={false}
          >
            {filteredTemplates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, selectedTemplate === template.id && styles.templateCardSelected]}
                onPress={() => handleTemplateSelect(template.id)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={template.gradient as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.templateGradient,
                    template.aspectRatio === '9:16' && { height: 180 },
                    template.aspectRatio === '16:9' && { height: 95 },
                    template.aspectRatio === '1:1' && { height: 130 },
                    template.aspectRatio === '4:5' && { height: 155 },
                  ]}
                >
                  <View style={styles.templateBadge}>
                    <Text style={styles.templateBadgeText}>{template.aspectRatio}</Text>
                  </View>
                  {selectedTemplate === template.id && (
                    <View style={styles.templateCheckmark}>
                      <Text style={styles.templateCheckmarkText}>✓</Text>
                    </View>
                  )}
                </LinearGradient>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateCategory}>{template.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── SOUNDS ── */}
      {activeTab === 1 && (
        <ScrollView contentContainerStyle={styles.soundsContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>🎵 Música de fondo</Text>
          {SOUNDS.map(sound => (
            <TouchableOpacity
              key={sound.id}
              style={[styles.soundCard, playingSound === sound.id && styles.soundCardActive]}
              onPress={() => handleSoundPreview(sound.id, sound.name)}
            >
              <View style={styles.soundLeft}>
                <View style={styles.soundIconBox}>
                  <Text style={styles.soundEmoji}>{sound.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.soundName}>{sound.name}</Text>
                  <Text style={styles.soundMeta}>{sound.category} · {sound.duration}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.soundPlayBtn, playingSound === sound.id && styles.soundPlayBtnActive]}
                onPress={() => handleSoundPreview(sound.id, sound.name)}
              >
                <Text style={styles.soundPlayBtnText}>{playingSound === sound.id ? '⏸' : '▶'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>🎤 Efectos de sonido</Text>
          <View style={styles.sfxGrid}>
            {SOUND_EFFECTS.map(sfx => (
              <TouchableOpacity
                key={sfx.id}
                style={[styles.sfxCard, playingSound === sfx.id && styles.sfxCardActive]}
                onPress={() => handleSoundPreview(sfx.id, sfx.name)}
              >
                <Text style={styles.sfxEmoji}>{sfx.emoji}</Text>
                <Text style={styles.sfxName}>{sfx.name}</Text>
                <Text style={styles.sfxCategory}>{sfx.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── MÚSICA ── */}
      {activeTab === 2 && (
        <ScrollView contentContainerStyle={styles.musicContent} showsVerticalScrollIndicator={false}>
          <View style={styles.musicBanner}>
            <Text style={styles.musicBannerEmoji}>🎵</Text>
            <Text style={styles.musicBannerTitle}>Biblioteca Musical</Text>
            <Text style={styles.musicBannerText}>
              Más de 200 pistas libres de derechos de autor para usar en tus creaciones sin restricciones en Play Store y redes sociales.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Géneros disponibles</Text>
          <View style={styles.genreGrid}>
            {MUSIC_GENRES.map(genre => (
              <TouchableOpacity
                key={genre.id}
                style={styles.genreCard}
                onPress={() => Alert.alert(
                  `${genre.emoji} ${genre.name}`,
                  `${genre.tracks} pistas disponibles en este género.\n\nIntegra tu biblioteca de audio en /assets/music/${genre.id}/ para activar la reproducción.`,
                  [{ text: 'Entendido' }]
                )}
              >
                <LinearGradient
                  colors={['#1e1e2e', '#13131a']}
                  style={styles.genreGradient}
                >
                  <Text style={styles.genreEmoji}>{genre.emoji}</Text>
                  <Text style={styles.genreName}>{genre.name}</Text>
                  <Text style={styles.genreTracks}>{genre.tracks} pistas</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.licenseCard}>
            <Text style={styles.licenseTitle}>✅ 100% libre de derechos</Text>
            <Text style={styles.licenseText}>
              Toda la música está bajo licencia Creative Commons o es de dominio público. Puedes usarla en:
            </Text>
            <Text style={styles.licenseItem}>• Instagram, TikTok, YouTube</Text>
            <Text style={styles.licenseItem}>• Uso comercial permitido</Text>
            <Text style={styles.licenseItem}>• Sin restricciones de monetización</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  headerSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },

  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: RADIUS.md },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textMuted },
  tabTextActive: { color: '#fff' },

  categoryScroll: { maxHeight: 48, marginBottom: SPACING.sm },
  categoryScrollContent: { paddingHorizontal: SPACING.lg, gap: 8, alignItems: 'center' },
  categoryChip: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border,
  },
  categoryChipActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  categoryChipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  categoryChipTextActive: { color: COLORS.primaryLight, fontWeight: FONTS.weights.semibold },

  templatesGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: 32,
  },
  templateCard: {
    width: CARD_WIDTH, borderRadius: RADIUS.xl, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  templateCardSelected: { borderColor: COLORS.primary },
  templateGradient: { width: '100%', justifyContent: 'space-between', padding: 10 },
  templateBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2,
  },
  templateBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  templateCheckmark: {
    position: 'absolute', bottom: 8, right: 8,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  templateCheckmarkText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  templateInfo: { padding: SPACING.sm, backgroundColor: COLORS.surface },
  templateName: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  templateCategory: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 1 },

  soundsContent: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: 32 },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: 4 },
  soundCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  soundCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryGlow },
  soundLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  soundIconBox: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center',
  },
  soundEmoji: { fontSize: 22 },
  soundName: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  soundMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  soundPlayBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  soundPlayBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  soundPlayBtnText: { fontSize: 14, color: COLORS.text },

  sfxGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  sfxCard: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.sm, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sfxCardActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  sfxEmoji: { fontSize: 24 },
  sfxName: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.text, textAlign: 'center' },
  sfxCategory: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },

  musicContent: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: 32 },
  musicBanner: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm,
    borderWidth: 1, borderColor: '#7c3aed30',
  },
  musicBannerEmoji: { fontSize: 40 },
  musicBannerTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  musicBannerText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  genreCard: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    borderRadius: RADIUS.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  genreGradient: { padding: SPACING.sm, alignItems: 'center', gap: 4, minHeight: 80, justifyContent: 'center' },
  genreEmoji: { fontSize: 24 },
  genreName: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, color: COLORS.text, textAlign: 'center' },
  genreTracks: { fontSize: 9, color: COLORS.textMuted },

  licenseCard: {
    backgroundColor: '#10b98110', borderRadius: RADIUS.xl,
    padding: SPACING.lg, borderWidth: 1, borderColor: '#10b98130', gap: 6,
  },
  licenseTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.success },
  licenseText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  licenseItem: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
});
