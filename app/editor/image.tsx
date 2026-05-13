// app/editor/image.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Image, ActivityIndicator, Alert, Dimensions, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import {
  rotateImage, flipImage, resizeImage,
  saveToGallery, shareImage, imageToBase64,
  FILTER_PRESETS,
} from '../../services/imageService';
import { generateCaption, analyzeImageWithGPT } from '../../services/aiService';

const { width } = Dimensions.get('window');

const TOOLS = [
  { id: 'filters', emoji: '🎨', label: 'Filtros' },
  { id: 'adjust', emoji: '☀️', label: 'Ajustar' },
  { id: 'rotate', emoji: '🔄', label: 'Rotar' },
  { id: 'flip', emoji: '↔️', label: 'Voltear' },
  { id: 'caption', emoji: '💬', label: 'Caption IA' },
  { id: 'analyze', emoji: '🔍', label: 'Analizar' },
];

const CAPTION_TONES = [
  { id: 'casual', label: '😊 Casual' },
  { id: 'professional', label: '💼 Profesional' },
  { id: 'funny', label: '😂 Gracioso' },
  { id: 'inspirational', label: '⭐ Inspiracional' },
  { id: 'tiktok', label: '🎵 TikTok' },
];

export default function ImageEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uri?: string }>();
  const { openaiKey } = useApp();

  const [imageUri, setImageUri] = useState<string | null>(params.uri || null);
  const [activeTool, setActiveTool] = useState('filters');
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [captionTone, setCaptionTone] = useState('casual');
  const [analysisPrompt, setAnalysisPrompt] = useState('Describe esta imagen en detalle.');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: false,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso de cámara requerido'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleRotate = async () => {
    if (!imageUri) return;
    setLoading(true);
    try {
      const rotated = await rotateImage(imageUri, 90);
      setImageUri(rotated);
    } catch { Alert.alert('Error', 'No se pudo rotar la imagen.'); }
    finally { setLoading(false); }
  };

  const handleFlip = async (dir: 'horizontal' | 'vertical') => {
    if (!imageUri) return;
    setLoading(true);
    try {
      const flipped = await flipImage(imageUri, dir);
      setImageUri(flipped);
    } catch { Alert.alert('Error', 'No se pudo voltear la imagen.'); }
    finally { setLoading(false); }
  };

  const handleGenerateCaption = async () => {
    if (!imageUri) return;
    if (!openaiKey) { Alert.alert('API Key requerida', 'Configura tu OpenAI API Key en Ajustes.'); return; }
    setLoading(true);
    setCaption('');
    try {
      const b64 = await imageToBase64(imageUri);
      const result = await generateCaption(b64, captionTone, openaiKey);
      setCaption(result);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo generar el caption.');
    } finally { setLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;
    if (!openaiKey) { Alert.alert('API Key requerida', 'Configura tu OpenAI API Key en Ajustes.'); return; }
    setLoading(true);
    setAnalysis('');
    try {
      const b64 = await imageToBase64(imageUri);
      const result = await analyzeImageWithGPT(b64, analysisPrompt, openaiKey);
      setAnalysis(result);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo analizar la imagen.');
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!imageUri) return;
    const ok = await saveToGallery(imageUri);
    Alert.alert(ok ? '✅ Guardada' : '❌ Error', ok ? 'Imagen guardada en tu galería.' : 'No se pudo guardar.');
  };

  const currentFilter = FILTER_PRESETS[selectedFilter];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✏️ Editor de Imagen</Text>
        <View style={styles.headerActions}>
          {imageUri && (
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>💾</Text>
            </TouchableOpacity>
          )}
          {imageUri && (
            <TouchableOpacity onPress={() => shareImage(imageUri)} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>📤</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Image Preview */}
      {!imageUri ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🖼️</Text>
          <Text style={styles.emptyTitle}>Sin imagen</Text>
          <Text style={styles.emptySubtitle}>Selecciona una foto para empezar a editar</Text>
          <View style={styles.pickButtons}>
            <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
              <Text style={styles.pickBtnText}>📁 Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pickBtn, { borderColor: COLORS.accent }]} onPress={takePhoto}>
              <Text style={[styles.pickBtnText, { color: COLORS.accent }]}>📷 Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Image + Filter Preview */}
          <View style={styles.imageContainer}>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS.primaryLight} />
                <Text style={styles.loadingText}>Procesando...</Text>
              </View>
            )}
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.previewImage,
                {
                  opacity: currentFilter.brightness,
                  // Note: Full CSS filter simulation requires expo-gl or react-native-image-filter-kit
                  // These are approximations via tintColor and opacity
                },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.filterLabel}>{currentFilter.name}</Text>
          </View>

          {/* Tool Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolBar} contentContainerStyle={styles.toolBarContent}>
            {TOOLS.map(tool => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolBtn, activeTool === tool.id && styles.toolBtnActive]}
                onPress={() => setActiveTool(tool.id)}
              >
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                <Text style={[styles.toolLabel, activeTool === tool.id && styles.toolLabelActive]}>
                  {tool.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tool Panels */}
          <ScrollView style={styles.toolPanel} contentContainerStyle={styles.toolPanelContent} showsVerticalScrollIndicator={false}>

            {/* Filters */}
            {activeTool === 'filters' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FILTER_PRESETS.map((filter, index) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[styles.filterCard, selectedFilter === index && styles.filterCardActive]}
                    onPress={() => setSelectedFilter(index)}
                  >
                    <Image source={{ uri: imageUri }} style={styles.filterThumb} resizeMode="cover" />
                    <Text style={[styles.filterName, selectedFilter === index && styles.filterNameActive]}>
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Rotate & Flip */}
            {activeTool === 'rotate' && (
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleRotate}>
                  <Text style={styles.actionEmoji}>↻</Text>
                  <Text style={styles.actionLabel}>Rotar 90°</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleRotate()}>
                  <Text style={styles.actionEmoji}>↺</Text>
                  <Text style={styles.actionLabel}>Rotar -90°</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTool === 'flip' && (
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleFlip('horizontal')}>
                  <Text style={styles.actionEmoji}>↔️</Text>
                  <Text style={styles.actionLabel}>Horizontal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleFlip('vertical')}>
                  <Text style={styles.actionEmoji}>↕️</Text>
                  <Text style={styles.actionLabel}>Vertical</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Caption IA */}
            {activeTool === 'caption' && (
              <View style={styles.aiPanel}>
                <Text style={styles.aiPanelTitle}>💬 Caption con IA</Text>
                <Text style={styles.aiPanelSubtitle}>Tono del caption:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {CAPTION_TONES.map(t => (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.toneChip, captionTone === t.id && styles.toneChipActive]}
                      onPress={() => setCaptionTone(t.id)}
                    >
                      <Text style={[styles.toneChipText, captionTone === t.id && styles.toneChipTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.aiBtn, loading && { opacity: 0.6 }]}
                  onPress={handleGenerateCaption}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.aiBtnText}>✨ Generar Caption</Text>
                  }
                </TouchableOpacity>
                {caption ? (
                  <View style={styles.captionResult}>
                    <Text style={styles.captionText}>{caption}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* Analyze */}
            {activeTool === 'analyze' && (
              <View style={styles.aiPanel}>
                <Text style={styles.aiPanelTitle}>🔍 Análisis con IA</Text>
                <TextInput
                  style={styles.analysisInput}
                  value={analysisPrompt}
                  onChangeText={setAnalysisPrompt}
                  placeholder="Pregunta sobre la imagen..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                />
                <TouchableOpacity
                  style={[styles.aiBtn, loading && { opacity: 0.6 }]}
                  onPress={handleAnalyze}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.aiBtnText}>🔍 Analizar imagen</Text>
                  }
                </TouchableOpacity>
                {analysis ? (
                  <View style={styles.captionResult}>
                    <Text style={styles.captionText}>{analysis}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {activeTool === 'adjust' && (
              <View style={styles.aiPanel}>
                <Text style={styles.aiPanelTitle}>☀️ Ajustes</Text>
                <Text style={styles.aiPanelSubtitle}>Selecciona un filtro en la pestaña "Filtros" para ajustar brillo, contraste y saturación automáticamente.</Text>
                <View style={styles.adjustInfo}>
                  <Text style={styles.adjustInfoText}>Filtro actual: <Text style={{ color: COLORS.primaryLight }}>{currentFilter.name}</Text></Text>
                  <Text style={styles.adjustInfoText}>Brillo: {currentFilter.brightness}x</Text>
                  <Text style={styles.adjustInfoText}>Contraste: {currentFilter.contrast}x</Text>
                  <Text style={styles.adjustInfoText}>Saturación: {currentFilter.saturation}x</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Change Image */}
          <View style={styles.changeImageRow}>
            <TouchableOpacity style={styles.changeBtn} onPress={pickImage}>
              <Text style={styles.changeBtnText}>📁 Cambiar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.changeBtn, { borderColor: COLORS.accent }]} onPress={takePhoto}>
              <Text style={[styles.changeBtnText, { color: COLORS.accent }]}>📷 Cámara</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  backBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.md },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  saveBtn: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { fontSize: 18 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md, padding: SPACING.xl },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center' },
  pickButtons: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
  pickBtn: {
    borderRadius: RADIUS.xl, paddingHorizontal: 24, paddingVertical: 12,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  pickBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold },

  imageContainer: { height: 220, backgroundColor: '#000', position: 'relative' },
  previewImage: { width: '100%', height: '100%' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10,
  },
  loadingText: { color: '#fff', fontSize: FONTS.sizes.sm },
  filterLabel: {
    position: 'absolute', bottom: 8, right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: RADIUS.sm,
    paddingHorizontal: 8, paddingVertical: 3,
    color: '#fff', fontSize: FONTS.sizes.xs,
  },

  toolBar: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border, maxHeight: 72 },
  toolBarContent: { paddingHorizontal: SPACING.sm, gap: 4, alignItems: 'center' },
  toolBtn: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md },
  toolBtnActive: { backgroundColor: COLORS.primaryGlow },
  toolEmoji: { fontSize: 20 },
  toolLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  toolLabelActive: { color: COLORS.primaryLight },

  toolPanel: { flex: 1 },
  toolPanelContent: { padding: SPACING.md, paddingBottom: 16 },

  filterCard: { alignItems: 'center', marginRight: SPACING.md, gap: 4 },
  filterCardActive: {},
  filterThumb: { width: 72, height: 72, borderRadius: RADIUS.md, borderWidth: 2, borderColor: 'transparent' },
  filterName: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center' },
  filterNameActive: { color: COLORS.primaryLight, fontWeight: FONTS.weights.bold },

  actionGrid: { flexDirection: 'row', gap: SPACING.md },
  actionBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  actionEmoji: { fontSize: 32 },
  actionLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },

  aiPanel: { gap: SPACING.md },
  aiPanelTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text },
  aiPanelSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  toneChip: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 7, marginRight: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  toneChipActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  toneChipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  toneChipTextActive: { color: COLORS.primaryLight, fontWeight: FONTS.weights.semibold },
  aiBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center',
  },
  aiBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  captionResult: {
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  captionText: { color: COLORS.text, fontSize: FONTS.sizes.sm, lineHeight: 22 },

  analysisInput: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md,
    color: COLORS.text, fontSize: FONTS.sizes.md, borderWidth: 1,
    borderColor: COLORS.border, minHeight: 80, textAlignVertical: 'top',
  },

  adjustInfo: { gap: 6 },
  adjustInfoText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },

  changeImageRow: {
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  changeBtn: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.sm,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary,
  },
  changeBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
});
