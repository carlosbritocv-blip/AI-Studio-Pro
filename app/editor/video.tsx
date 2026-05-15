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
  { id: '1', label: '1x' },
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
    { id: 'info', emoji: 'ℹ️', label: 'Info' },
  ];

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
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
  };

  const handleSpeedChange = async (speed: string) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(parseFloat(speed), true);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎬 Editor de Vídeo</Text>
        {videoUri && (
          <TouchableOpacity onPress={() => saveToGallery(videoUri)} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>💾 Guardar</Text>
          </TouchableOpacity>
        )}
      </View>

      {!videoUri ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>Sin vídeo</Text>
          <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
            <Text style={styles.pickBtnText}>📁 Seleccionar Vídeo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={handlePlaybackStatus}
              isMuted={isMuted}
              isLooping
            />
            <TouchableOpacity style={styles.playOverlay} onPress={handlePlayPause}>
              {!isPlaying && <View style={styles.playButton}><Text style={styles.playButtonText}>▶</Text></View>}
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }]} />
            </View>
            <View style={styles.progressTimes}>
              <Text style={styles.progressTime}>{formatTime(position)}</Text>
              <Text style={styles.progressTime}>{formatTime(duration)}</Text>
            </View>
          </View>

          <ScrollView horizontal style={styles.toolBar} contentContainerStyle={styles.toolBarContent}>
            {VIDEO_TOOLS.map(tool => (
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
            {activeTool === 'speed' && (
              <View style={styles.speedPanel}>
                {SPEEDS.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.speedBtn, playbackSpeed === s.id && styles.speedBtnActive]}
                    onPress={() => handleSpeedChange(s.id)}
                  >
                    <Text style={styles.speedBtnText}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {activeTool === 'audio' && (
              <TouchableOpacity style={styles.audioToggle} onPress={() => setIsMuted(!isMuted)}>
                <Text style={styles.audioToggleEmoji}>{isMuted ? '🔇' : '🔊'}</Text>
                <Text style={styles.audioToggleLabel}>{isMuted ? 'Activar Audio' : 'Silenciar Audio'}</Text>
              </TouchableOpacity>
            )}
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
  backBtnText: { color: COLORS.primaryLight, fontSize: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  saveBtn: { padding: 8, backgroundColor: COLORS.primaryGlow, borderRadius: 8 },
  saveBtnText: { color: COLORS.primaryLight, fontWeight: 'bold' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, color: COLORS.text, marginTop: 10 },
  pickBtn: { marginTop: 20, padding: 15, backgroundColor: COLORS.primary, borderRadius: 10 },
  pickBtnText: { color: '#fff', fontWeight: 'bold' },
  videoContainer: { height: 250, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  playButtonText: { color: '#fff', fontSize: 24 },
  progressContainer: { padding: 20 },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.primaryLight },
  progressTimes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  progressTime: { fontSize: 12, color: COLORS.textMuted },
  toolBar: { maxHeight: 70, borderTopWidth: 1, borderColor: COLORS.border },
  toolBarContent: { paddingHorizontal: 10, gap: 15, alignItems: 'center' },
  toolBtn: { alignItems: 'center' },
  toolBtnActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  toolEmoji: { fontSize: 20 },
  toolLabel: { fontSize: 10, color: COLORS.textMuted },
  toolLabelActive: { color: COLORS.primaryLight },
  toolPanel: { flex: 1, padding: 20 },
  speedPanel: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  speedBtn: { padding: 10, backgroundColor: COLORS.surface, borderRadius: 10, minWidth: 60, alignItems: 'center' },
  speedBtnActive: { backgroundColor: COLORS.primaryGlow },
  speedBtnText: { color: COLORS.text },
  audioToggle: { flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: COLORS.surface, padding: 20, borderRadius: 10 },
  audioToggleEmoji: { fontSize: 30 },
  audioToggleLabel: { color: COLORS.text, fontWeight: 'bold' }
});
