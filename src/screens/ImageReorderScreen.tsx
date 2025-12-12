import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { RootStackParamList } from '../navigation/AppNavigator';
import { generatePdfFromImages } from '../services/pdfService';
import { ImageItem, useImageStore } from '../store/imageStore';

const accent = '#7c3aed';

type Props = StackScreenProps<RootStackParamList, 'ImageReorder'>;

const ImageReorderScreen = ({ navigation }: Props) => {
  const images = useImageStore((s) => s.images);
  const reorderImages = useImageStore((s) => s.reorderImages);
  const setPdfPath = useImageStore((s) => s.setPdfPath);
  const [generating, setGenerating] = useState(false);

  const onGenerate = useCallback(async () => {
    if (!images.length) {
      Alert.alert('Add images', 'Pick at least one image to generate a PDF.');
      return;
    }
    try {
      setGenerating(true);
      const pdfUri = await generatePdfFromImages(images);
      setPdfPath(pdfUri);
      navigation.navigate('PdfPreview', { uri: pdfUri });
    } catch (err) {
      Alert.alert('PDF error', 'Could not generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [images, navigation, setPdfPath]);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ImageItem>) => (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardActive]}
        onLongPress={drag}
        delayLongPress={120}
        onPress={() => navigation.navigate('ImageEditor', { imageId: item.id })}
      >
        <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
        <View style={styles.cardFooter}>
          <Text style={styles.cardText}>Tap to edit • Long press to drag</Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <DraggableFlatList
          data={images}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => reorderImages(data)}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={styles.empty}>No images yet. Pick some to begin.</Text>}
        />
        <TouchableOpacity style={styles.primaryBtn} onPress={onGenerate} disabled={generating}>
          {generating ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Generate PDF</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1224' },
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#11182c',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardActive: { borderColor: accent, transform: [{ scale: 1.01 }] },
  image: { width: '100%', height: 220 },
  cardFooter: { padding: 12 },
  cardText: { color: '#cbd5e1', fontSize: 14 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 20 },
  primaryBtn: {
    backgroundColor: accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
});

export default ImageReorderScreen;
