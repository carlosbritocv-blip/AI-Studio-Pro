// app/editor/image.tsx
import React, { useState } from 'react';
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
  rotateImage, flipImage, saveToGallery, shareImage, imageToBase64,
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
  const { openaiKey, credits } = useApp();

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

  const handleRotate = async (degrees: number) => {
    if (!imageUri) return;
    setLoading(true);
    try {
      const rotated = await rotateImage(imageUri, degrees);
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
    try {
      const b64 = await imageToBase64(imageUri);
      const result = await generateCaption(b64, captionTone, openaiKey);
      setCaption(result);
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo generar el caption.');
    } finally { setLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;
    if (!openaiKey) { Alert.alert('API Key requerida', 'Configura tu OpenAI API Key en Ajustes.'); return; }
    setLoading(true);
    try {
      const b64 = await imageToBase64(imageUri);
      const result = await analyzeImageWithGPT(b64, analysisPrompt, openaiKey);
      setAnalysis(result);
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo analizar la imagen.');
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
        </View>
      </View>

      {!imageUri ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🖼️</Text>
          <Text style={styles.emptyTitle}>Sin imagen</Text>
          <View style={styles.pickButtons}>
            <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
              <Text style={styles.pickBtnText}>📁 Galería</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS.primaryLight} />
              </View>
            )}
            <Image
              source={{ uri: imageUri }}
              style={[styles.previewImage, { opacity: currentFilter.brightness }]}
              resizeMode="contain"
            />
          </View>

          <ScrollView horizontal style={styles.toolBar} contentContainerStyle={styles.toolBarContent}>
            {TOOLS.map(tool => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolBtn, activeTool === tool.id && styles.toolBtnActive]}
                onPress={() => setActiveTool(tool.id)}
              >
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                <Text style={[styles.toolLabel, activeTool === tool.id && styles.toolLabelActive]}>{tool.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.toolPanel}>
            {activeTool === 'rotate' && (
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleRotate(90)}>
                  <Text style={styles.actionEmoji}>↻</Text>
                  <Text style={styles.actionLabel}>90°</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleRotate(-90)}>
                  <Text style={styles.actionEmoji}>↺</Text>
                  <Text style={styles.actionLabel}>-90°</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTool === 'flip' && (
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleFlip('horizontal')}>
                  <Text style={styles.actionEmoji}>↔️</Text>
                  <Text style={styles.actionLabel}>Horizontal</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* El resto de paneles (filters, caption, analyze, adjust) se mantienen igual en tu lógica */}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.lg },
  backBtn: { padding: 4 },
  backBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.md },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.text },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  saveBtn: { backgroundColor: COLORS.surface, borderRadius: 8, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 18 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  pickButtons: { marginTop: 20 },
  pickBtn: { borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.primary },
  pickBtnText: { color: COLORS.primaryLight },
  imageContainer: { height: 300, backgroundColor: '#000' },
  previewImage: { width: '100%', height: '100%' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  toolBar: { maxHeight: 80, borderTopWidth: 1, borderColor: COLORS.border },
  toolBarContent: { paddingHorizontal: 10, gap: 10 },
  toolBtn: { alignItems: 'center', padding: 10 },
  toolBtnActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  toolEmoji: { fontSize: 20 },
  toolLabel: { fontSize: 10, color: COLORS.textMuted },
  toolLabelActive: { color: COLORS.primaryLight },
  toolPanel: { flex: 1, padding: 20 },
  actionGrid: { flexDirection: 'row', gap: 20 },
  actionBtn: { flex: 1, backgroundColor: COLORS.surface, padding: 20, alignItems: 'center', borderRadius: 10 },
  actionEmoji: { fontSize: 30 },
  actionLabel: { color: COLORS.textSecondary }
});
