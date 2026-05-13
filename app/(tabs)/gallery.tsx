// app/(tabs)/gallery.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Dimensions, Alert, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { shareImage } from '../../services/imageService';

const { width } = Dimensions.get('window');
const IMG_SIZE = (width - SPACING.lg * 2 - 4) / 3;

export default function GalleryScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
          first: 60,
          sortBy: MediaLibrary.SortBy.creationTime,
        });
        setPhotos(assets);
      }
      setLoading(false);
    })();
  }, []);

  const handleLongPress = (asset: MediaLibrary.Asset) => {
    setSelected(asset.id === selected ? null : asset.id);
  };

  const handlePress = (asset: MediaLibrary.Asset) => {
    if (selected) {
      setSelected(asset.id === selected ? null : asset.id);
    } else {
      Alert.alert(
        asset.mediaType === 'video' ? '🎬 Vídeo' : '🖼️ Imagen',
        '¿Qué quieres hacer con este archivo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: '✏️ Editar',
            onPress: () => {
              if (asset.mediaType === 'video') {
                router.push({ pathname: '/editor/video', params: { uri: asset.uri } });
              } else {
                router.push({ pathname: '/editor/image', params: { uri: asset.uri } });
              }
            },
          },
          { text: '📤 Compartir', onPress: () => shareImage(asset.uri) },
        ]
      );
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.permissionState}>
          <Text style={styles.permEmoji}>🔒</Text>
          <Text style={styles.permTitle}>Sin acceso a la galería</Text>
          <Text style={styles.permText}>Permite el acceso en la configuración de tu dispositivo para ver tus fotos y vídeos aquí.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🖼️ Galería</Text>
        <Text style={styles.headerCount}>{photos.length} archivos</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Cargando galería...</Text>
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>No hay archivos en tu galería</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          numColumns={3}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.thumbnail, selected === item.id && styles.thumbnailSelected]}
              onPress={() => handlePress(item)}
              onLongPress={() => handleLongPress(item)}
            >
              <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
              {item.mediaType === 'video' && (
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoIcon}>▶</Text>
                  <Text style={styles.videoDuration}>
                    {Math.floor(item.duration / 60)}:{(Math.floor(item.duration) % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
              )}
              {selected === item.id && (
                <View style={styles.selectedOverlay}>
                  <Text style={styles.selectedCheck}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {selected && (
        <View style={styles.selectionBar}>
          <TouchableOpacity
            style={styles.selectionBtn}
            onPress={() => {
              const asset = photos.find(p => p.id === selected);
              if (asset) {
                if (asset.mediaType === 'video') router.push({ pathname: '/editor/video', params: { uri: asset.uri } });
                else router.push({ pathname: '/editor/image', params: { uri: asset.uri } });
              }
              setSelected(null);
            }}
          >
            <Text style={styles.selectionBtnText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectionBtn}
            onPress={async () => {
              const asset = photos.find(p => p.id === selected);
              if (asset) await shareImage(asset.uri);
              setSelected(null);
            }}
          >
            <Text style={styles.selectionBtnText}>📤 Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.selectionBtn, { borderColor: COLORS.error }]} onPress={() => setSelected(null)}>
            <Text style={[styles.selectionBtnText, { color: COLORS.error }]}>✕ Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.extrabold, color: COLORS.text },
  headerCount: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  permissionState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: SPACING.xl },
  permEmoji: { fontSize: 48 },
  permTitle: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  permText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textSecondary },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: COLORS.textSecondary },
  grid: { padding: SPACING.lg, paddingBottom: 32, gap: 2 },
  row: { gap: 2, marginBottom: 2 },
  thumbnail: { width: IMG_SIZE, height: IMG_SIZE, borderRadius: 4, overflow: 'hidden' },
  thumbnailSelected: { opacity: 0.7, borderWidth: 2, borderColor: COLORS.primary },
  thumbnailImage: { width: '100%', height: '100%' },
  videoOverlay: {
    position: 'absolute', bottom: 4, left: 4,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  videoIcon: { color: '#fff', fontSize: 8 },
  videoDuration: { color: '#fff', fontSize: 9 },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(124,58,237,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  selectedCheck: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  selectionBar: {
    flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  selectionBtn: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.sm,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary,
  },
  selectionBtnText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
});
