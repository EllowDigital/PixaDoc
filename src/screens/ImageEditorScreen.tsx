import { StackScreenProps } from '@react-navigation/stack';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ImageItem, useImageStore } from '../store/imageStore';

const accent = '#7c3aed';

type Props = StackScreenProps<RootStackParamList, 'ImageEditor'>;

type CropPreset = 'square' | 'a4';

const computeCrop = (img: ImageItem, preset: CropPreset) => {
  const ratio = preset === 'square' ? 1 : 210 / 297; // A4 portrait ratio
  const { width, height } = img;
  if (!width || !height) return undefined;

  const currentRatio = width / height;
  let targetWidth = width;
  let targetHeight = height;

  if (currentRatio > ratio) {
    targetWidth = height * ratio;
  } else {
    targetHeight = width / ratio;
  }

  const originX = (width - targetWidth) / 2;
  const originY = (height - targetHeight) / 2;

  return {
    originX,
    originY,
    width: targetWidth,
    height: targetHeight,
  };
};

const ImageEditorScreen = ({ route, navigation }: Props) => {
  const { imageId } = route.params;
  const image = useImageStore((s) => s.images.find((img) => img.id === imageId));
  const updateImage = useImageStore((s) => s.updateImage);
  const [working, setWorking] = useState(false);

  const cropSquare = useMemo(() => (image ? computeCrop(image, 'square') : undefined), [image]);
  const cropA4 = useMemo(() => (image ? computeCrop(image, 'a4') : undefined), [image]);

  const runManipulation = useCallback(
    async (actions: ImageManipulator.Action[]) => {
      if (!image) return;
      try {
        setWorking(true);
        const manipulated = await ImageManipulator.manipulateAsync(image.uri, actions, {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        updateImage(image.id, {
          uri: manipulated.uri,
          width: manipulated.width,
          height: manipulated.height,
        });
      } catch (err) {
        Alert.alert('Edit error', 'Could not update this image.');
      } finally {
        setWorking(false);
      }
    },
    [image, updateImage],
  );

  if (!image) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.muted}>Image not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="contain" />
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => runManipulation([{ rotate: 90 }])}
            disabled={working}
          >
            {working ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Rotate 90°</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => cropSquare && runManipulation([{ crop: cropSquare }])}
            disabled={working || !cropSquare}
          >
            <Text style={styles.actionText}>Crop Square</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => cropA4 && runManipulation([{ crop: cropA4 }])}
            disabled={working || !cropA4}
          >
            <Text style={styles.actionText}>Crop A4</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} disabled={working}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1224' },
  container: { flex: 1, padding: 16, justifyContent: 'space-between' },
  preview: { width: '100%', height: 420, borderRadius: 12, backgroundColor: '#0f172a' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 8 },
  actionBtn: {
    flex: 1,
    backgroundColor: accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: { color: '#f8fafc', fontWeight: '700' },
  doneBtn: {
    backgroundColor: '#1f2937',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  doneText: { color: '#e2e8f0', fontWeight: '700', fontSize: 16 },
  muted: { color: '#94a3b8' },
});

export default ImageEditorScreen;
