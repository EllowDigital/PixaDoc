import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useImageStore } from '../store/imageStore';

const accent = '#7c3aed';

const HomeScreen = ({ navigation }: StackScreenProps<RootStackParamList, 'Home'>) => {
  const images = useImageStore((s) => s.images);
  const pdfPath = useImageStore((s) => s.pdfPath);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>PixaDoc</Text>
          <Text style={styles.subtitle}>Offline image to PDF conversion. No logins, no uploads, just fast and secure.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('ImagePicker')}>
            <Text style={styles.primaryText}>Start new PDF</Text>
          </TouchableOpacity>
          {images.length > 0 && (
            <TouchableOpacity
              style={[styles.secondaryBtn, { marginTop: 12 }]}
              onPress={() => navigation.navigate('ImageReorder')}
            >
              <Text style={styles.secondaryText}>Continue arranging ({images.length})</Text>
            </TouchableOpacity>
          )}
          {pdfPath && (
            <TouchableOpacity
              style={[styles.secondaryBtn, { marginTop: 12 }]}
              onPress={() => navigation.navigate('PdfPreview', { uri: pdfPath })}
            >
              <Text style={styles.secondaryText}>Open last PDF</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.callouts}>
          <Text style={styles.calloutTitle}>Why PixaDoc?</Text>
          <Text style={styles.calloutItem}>• 100% offline conversion</Text>
          <Text style={styles.calloutItem}>• Crop, rotate, and reorder pages</Text>
          <Text style={styles.calloutItem}>• Save or share instantly</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1224' },
  container: { flex: 1, padding: 20, backgroundColor: '#0b1224' },
  heroCard: {
    backgroundColor: '#11182c',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: { color: '#f8fafc', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#cbd5e1', fontSize: 16, lineHeight: 22, marginBottom: 18 },
  primaryBtn: {
    backgroundColor: accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
  },
  secondaryText: { color: '#c084fc', fontWeight: '600', fontSize: 15 },
  callouts: { marginTop: 18 },
  calloutTitle: { color: '#e2e8f0', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  calloutItem: { color: '#94a3b8', fontSize: 15, marginBottom: 4 },
});

export default HomeScreen;
