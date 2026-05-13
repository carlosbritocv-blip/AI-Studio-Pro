// services/imageService.ts
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface ImageAdjustments {
  brightness: number;   // 0.1 - 3.0 (1.0 = normal)
  contrast: number;     // 0.1 - 3.0 (1.0 = normal)
  saturation: number;   // 0.0 - 3.0 (1.0 = normal, 0.0 = grayscale)
}

export interface CropArea {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

// ─── Crop Image ──────────────────────────────────────────────
export const cropImage = async (
  uri: string,
  crop: CropArea,
  compress: number = 0.9
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ crop }],
    { compress, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

// ─── Rotate Image ────────────────────────────────────────────
export const rotateImage = async (
  uri: string,
  degrees: number = 90
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ rotate: degrees }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

// ─── Flip Image ──────────────────────────────────────────────
export const flipImage = async (
  uri: string,
  direction: 'horizontal' | 'vertical' = 'horizontal'
): Promise<string> => {
  const flipAction = direction === 'horizontal'
    ? { flip: ImageManipulator.FlipType.Horizontal }
    : { flip: ImageManipulator.FlipType.Vertical };

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [flipAction],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

// ─── Resize Image ────────────────────────────────────────────
export const resizeImage = async (
  uri: string,
  width?: number,
  height?: number,
  compress: number = 0.85
): Promise<string> => {
  const resizeObj: { width?: number; height?: number } = {};
  if (width) resizeObj.width = width;
  if (height) resizeObj.height = height;

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: resizeObj }],
    { compress, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

// ─── Apply Multiple Operations ────────────────────────────────
export const applyImageOperations = async (
  uri: string,
  operations: ImageManipulator.Action[],
  compress: number = 0.9,
  format: ImageManipulator.SaveFormat = ImageManipulator.SaveFormat.JPEG
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    operations,
    { compress, format }
  );
  return result.uri;
};

// ─── Convert to Base64 ────────────────────────────────────────
export const imageToBase64 = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
};

// ─── Save to Gallery ──────────────────────────────────────────
export const saveToGallery = async (uri: string): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return false;

    // If it's a remote URL, download first
    let localUri = uri;
    if (uri.startsWith('http')) {
      const filename = `ai_studio_${Date.now()}.jpg`;
      const downloadDest = `${FileSystem.documentDirectory}${filename}`;
      const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, downloadDest);
      localUri = downloadedUri;
    }

    await MediaLibrary.saveToLibraryAsync(localUri);
    return true;
  } catch (e) {
    console.error('Error saving to gallery:', e);
    return false;
  }
};

// ─── Share Image ──────────────────────────────────────────────
export const shareImage = async (uri: string): Promise<void> => {
  try {
    let localUri = uri;
    if (uri.startsWith('http')) {
      const filename = `ai_studio_share_${Date.now()}.jpg`;
      const downloadDest = `${FileSystem.documentDirectory}${filename}`;
      const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, downloadDest);
      localUri = downloadedUri;
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Compartir desde AI Studio Pro',
      });
    }
  } catch (e) {
    console.error('Error sharing:', e);
  }
};

// ─── Download Remote Image ────────────────────────────────────
export const downloadRemoteImage = async (url: string): Promise<string> => {
  const filename = `ai_studio_${Date.now()}.jpg`;
  const destination = `${FileSystem.documentDirectory}${filename}`;
  const { uri } = await FileSystem.downloadAsync(url, destination);
  return uri;
};

// ─── Get Image Dimensions ─────────────────────────────────────
export const getImageDimensions = async (
  uri: string
): Promise<{ width: number; height: number }> => {
  const result = await ImageManipulator.manipulateAsync(uri, []);
  return { width: result.width, height: result.height };
};

// ─── Preset Filters (CSS-like via tint/overlay simulation) ───
export const FILTER_PRESETS = [
  { id: 'none', name: 'Original', brightness: 1.0, contrast: 1.0, saturation: 1.0 },
  { id: 'vivid', name: 'Vívido', brightness: 1.1, contrast: 1.15, saturation: 1.4 },
  { id: 'warm', name: 'Cálido', brightness: 1.05, contrast: 1.05, saturation: 1.2 },
  { id: 'cool', name: 'Frío', brightness: 1.0, contrast: 1.1, saturation: 0.85 },
  { id: 'vintage', name: 'Vintage', brightness: 0.95, contrast: 0.9, saturation: 0.7 },
  { id: 'mono', name: 'B&N', brightness: 1.0, contrast: 1.2, saturation: 0.0 },
  { id: 'dramatic', name: 'Dramático', brightness: 0.85, contrast: 1.4, saturation: 1.1 },
  { id: 'fade', name: 'Fade', brightness: 1.1, contrast: 0.85, saturation: 0.75 },
  { id: 'bright', name: 'Brillante', brightness: 1.25, contrast: 1.0, saturation: 1.15 },
  { id: 'dark', name: 'Oscuro', brightness: 0.7, contrast: 1.1, saturation: 0.9 },
  { id: 'lush', name: 'Lush', brightness: 1.05, contrast: 1.1, saturation: 1.6 },
  { id: 'matte', name: 'Matte', brightness: 1.0, contrast: 0.8, saturation: 0.9 },
];
