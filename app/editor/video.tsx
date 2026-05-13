// app/editor/video.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { saveToGallery } from '../../services/imageService';

const { width } = Dimensions.get('window');

const SPEEDS = [
  { id: '0.25', label: '0.25x' },
  { id: '0.5', label: '0.5x' },
  { id: '1', label: '1x (Normal)' },
  { id: '1.5', label: '1.5x' },
  { id: '2', label: '2x' },
];

export default function VideoEditorScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('playback');

  const VIDEO_TOOLS = [
    { id: 'playback', emoji: '▶️', label: 'Reproducción' },
    { id: 'speed', emoji: '⚡', label: 'Velocidad' },
    { id: 'audio', emoji: '🔊', label: 'Audio' },
    { id: 'trim', emoji: '✂️', label: 'Recortar' },
    { id: 'info', emoji: 'ℹ️', label: 'Info' },
  ];

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      videoMaxDuration: 300,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setIsPlaying(false);
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso de cámara requerido'); return; }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 60,
      quality: ImagePicker.UIImagePickerControllerQualityType.High,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = async (speed: string) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(parseFloat(speed), true);
    }
  };

  const handleMuteToggle = async () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
    }
  };

  const handlePlaybackStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!videoUri) return;
    setLoading(true);
    const ok = await saveToGallery(videoUri);
    setLoading(false);
    Alert.alert(ok ? '✅ Guardado' : '❌ Error', ok ? 'Vídeo guardado en galería.' : 'No se pudo guardar.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎬 Editor de Vídeo</Text>
        {videoUri && (
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            {loading ? <ActivityIndicator size="small" color={COLORS.primaryLight} /> : <Text style={styles.saveBtnText}>💾 Guardar</Text>}
          </TouchableOpacity>
        )}
      </View>

      {!videoUri ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>Sin vídeo</Text>
          <Text style={styles.emptySubtitle}>Selecciona o graba un vídeo para editar</Text>
          <View style={styles.pickButtons}>
            <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
              <Text style={styles.pickBtnText}>📁 Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pickBtn, { borderColor: COLORS.accent }]} onPress={recordVideo}>
              <Text style={[styles.pickBtnText, { color: COLORS.accent }]}>📷 Grabar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Video Player */}
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={handlePlaybackStatus}
              shouldPlay={false}
              isLooping
            />

            {/* Play overlay */}
            <TouchableOpacity style={styles.playOverlay} onPress={handlePlayPause}>
              {!isPlaying && (
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Mute button */}
            <TouchableOpacity style={styles.muteBtn} onPress={handleMuteToggle}>
              <Text style={styles.muteBtnText}>{isMuted ? '🔇' : '🔊'}</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' },
                ]}
              />
            </View>
            <View style={styles.progressTimes}>
              <Text style={styles.progressTime}>{formatTime(position)}</Text>
              <Text style={styles.progressTime}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Playback controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={async () => {
              await videoRef.current?.setPositionAsync(Math.max(0, position - 5000));
            }}>
              <Text style={styles.controlBtnText}>⏮ 5s</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainControlBtn} onPress={handlePlayPause}>
              <Text style={styles.mainControlBtnText}>{isPlaying ? '⏸' : '▶️'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} onPress={async () => {
              await videoRef.current?.setPositionAsync(Math.min(duration, position + 5000));
            }}>
              <Text style={styles.controlBtnText}>5s ⏭</Text>
            </TouchableOpacity>
          </View>

          {/* Tool Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolBar} contentContainerStyle={styles.toolBarContent}>
            {VIDEO_TOOLS.map(tool => (
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
          <ScrollView style={styles.toolPanel} contentContainerStyle={styles.toolPanelContent}>
            {activeTool === 'speed' && (
              <View style={styles.speedPanel}>
                <Text style={styles.panelTitle}>⚡ Velocidad de reproducción</Text>
                {SPEEDS.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.speedBtn, playbackSpeed === s.id && styles.speedBtnActive]}
                    onPress={() => handleSpeedChange(s.id)}
                  >
                    <Text style={[styles.speedBtnText, playbackSpeed === s.id && styles.speedBtnTextActive]}>
                      {s.label}
                    </Text>
                    {playbackSpeed === s.id && <Text style={styles.speedCheck}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTool === 'audio' && (
              <View style={styles.audioPanel}>
                <Text style={styles.panelTitle}>🔊 Control de Audio</Text>
                <TouchableOpacity style={styles.audioToggle} onPress={handleMuteToggle}>
                  <Text style={styles.audioToggleEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
                  <View>
                    <Text style={styles.audioToggleLabel}>{isMuted ? 'Audio silenciado' : 'Audio activo'}</Text>
                    <Text style={styles.audioToggleSub}>Toca para {isMuted ? 'activar' : 'silenciar'}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxText}>💡 Para añadir música de fondo, usa la sección de Plantillas → Sonidos y Music.</Text>
                </View>
              </View>
            )}

            {activeTool === 'trim' && (
              <View style={styles.trimPanel}>
                <Text style={styles.panelTitle}>✂️ Recortar Vídeo</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxText}>
                    El recorte avanzado de vídeo requiere FFmpeg nativo.{'\n\n'}
                    Para recortar: usa el reproductor para encontrar el punto exacto, nota los tiempos y usa una app de vídeo nativa para el corte preciso.{'\n\n'}
                    Posición actual: {formatTime(position)} / {formatTime(duration)}
                  </Text>
                </View>
              </View>
            )}

            {activeTool === 'info' && (
              <View style={styles.infoPanel}>
                <Text style={styles.panelTitle}>ℹ️ Información del vídeo</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoKey}>Duración</Text>
                    <Text style={styles.infoVal}>{formatTime(duration)}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoKey}>Velocidad</Text>
                    <Text style={styles.infoVal}>{playbackSpeed}x</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoKey}>Audio</Text>
                    <Text style={styles.infoVal}>{isMuted ? 'Mudo' : 'Activo'}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTool === 'playback' && (
              <View style={styles.infoPanel}>
                <Text style={styles.panelTitle}>▶️ Controles</Text>
                <Text style={styles.infoText}>Usa los botones de arriba para controlar la reproducción. Puedes avanzar/retroceder 5 segundos con los botones laterales.</Text>
              </View>
            )}
          </ScrollView>

          {/* Change video */}
          <View style={styles.changeRow}>
            <TouchableOpacity style={styles.changeBtn} onPress={pickVideo}>
              <Text style={styles.changeBtnText}>📁 Cambiar vídeo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.changeBtn, { borderColor: COLORS.accent }]} onPress={recordVideo}>
              <Text style={[styles.changeBtnText, { color: COLORS.accent }]}>📷 Grabar</Text>
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
  saveBtn: { borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.primaryGlow },
  saveBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },

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

  videoContainer: { height: 220, backgroundColor: '#000', position: 'relative' },
  video: { width: '100%', height: '100%' },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  playButton: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  playButtonText: { color: '#fff', fontSize: 20, marginLeft: 4 },
  muteBtn: {
    position: 'absolute', bottom: 10, right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: RADIUS.sm,
    padding: 6,
  },
  muteBtnText: { fontSize: 16 },

  progressContainer: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.primaryLight, borderRadius: 2 },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTime: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingBottom: SPACING.sm, gap: SPACING.xl,
  },
  controlBtn: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  controlBtnText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  mainControlBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  mainControlBtnText: { fontSize: 20 },

  toolBar: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border, maxHeight: 68 },
  toolBarContent: { paddingHorizontal: SPACING.sm, gap: 4, alignItems: 'center' },
  toolBtn: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.md },
  toolBtnActive: { backgroundColor: COLORS.primaryGlow },
  toolEmoji: { fontSize: 18 },
  toolLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  toolLabelActive: { color: COLORS.primaryLight },

  toolPanel: { flex: 1 },
  toolPanelContent: { padding: SPACING.md, paddingBottom: 16 },

  speedPanel: { gap: SPACING.sm },
  panelTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.text, marginBottom: 4 },
  speedBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  speedBtnActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  speedBtnText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  speedBtnTextActive: { color: COLORS.primaryLight, fontWeight: FONTS.weights.bold },
  speedCheck: { color: COLORS.primaryLight, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },

  audioPanel: { gap: SPACING.md },
  audioToggle: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  audioToggleEmoji: { fontSize: 32 },
  audioToggleLabel: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  audioToggleSub: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  trimPanel: { gap: SPACING.md },
  infoBox: {
    backgroundColor: COLORS.surfaceLight, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  infoBoxText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 22 },

  infoPanel: { gap: SPACING.md },
  infoGrid: { flexDirection: 'row', gap: SPACING.sm },
  infoItem: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  infoKey: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  infoVal: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  infoText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 22 },

  changeRow: {
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  changeBtn: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.sm,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary,
  },
  changeBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
});
