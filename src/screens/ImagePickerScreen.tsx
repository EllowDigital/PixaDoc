import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useImageStore } from '../store/imageStore';

const accent = '#7c3aed';

type Props = StackScreenProps<RootStackParamList, 'ImagePicker'>;

const ImagePickerScreen = ({ navigation }: Props) => {
  const addImages = useImageStore((s) => s.addImages);
  const setPdfPath = useImageStore((s) => s.setPdfPath);
  const images = useImageStore((s) => s.images);
  const [loading, setLoading] = useState(false);

  const requestPermission = useCallback(async () => {
    const { status, granted, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) return true;
    if (!granted && !canAskAgain) {
      Alert.alert('Permission required', 'Please enable media permissions in settings to continue.');
      return false;
    }
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert('Permission required', 'PixaDoc needs access to your photos to build PDFs.');
      return false;
    }
    return true;
  }, []);

  const handlePick = useCallback(async () => {
    const allowed = await requestPermission();
    if (!allowed) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        addImages(result.assets.map((asset) => ({ uri: asset.uri, width: asset.width, height: asset.height })));
        setPdfPath(undefined);
        navigation.navigate('ImageReorder');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to pick images. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [addImages, navigation, requestPermission]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handlePick} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Select images</Text>}
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Selected ({images.length})</Text>
          {images.length === 0 ? (
            <Text style={styles.muted}>No images yet. Pick to begin.</Text>
          ) : (
            <FlatList
              data={images}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} style={styles.thumbnail} resizeMode="cover" />
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1224' },
  container: { flex: 1, padding: 16 },
  primaryBtn: {
    backgroundColor: accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  sectionTitle: { color: '#e2e8f0', fontWeight: '700', fontSize: 16, marginBottom: 8 },
  muted: { color: '#94a3b8' },
  thumbnail: { width: 100, height: 100, borderRadius: 10 },
});

export default ImagePickerScreen;
