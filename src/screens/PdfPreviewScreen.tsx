import { StackScreenProps } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../navigation/AppNavigator';

const accent = '#7c3aed';

type Props = StackScreenProps<RootStackParamList, 'PdfPreview'>;

const PdfPreviewScreen = ({ route }: Props) => {
  const { uri } = route.params;
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        Alert.alert('Missing file', 'PDF not found. Please regenerate.');
        return;
      }
      const targetDir = `${FileSystem.documentDirectory ?? FileSystem.cacheDirectory}pixadoc/exports/`;
      const dirInfo = await FileSystem.getInfoAsync(targetDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
      }
      const target = `${targetDir}pixadoc-${Date.now()}.pdf`;
      await FileSystem.copyAsync({ from: uri, to: target });
      Alert.alert('Saved', 'PDF copied to app storage. You can share it anytime.');
    } catch (err) {
      Alert.alert('Save error', 'Unable to save this file.');
    } finally {
      setSaving(false);
    }
  }, [uri]);

  const handleShare = useCallback(async () => {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Not available', 'Sharing is not available on this device.');
      return;
    }
    try {
      setSharing(true);
      await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
    } catch (err) {
      Alert.alert('Share error', 'Unable to share this file.');
    } finally {
      setSharing(false);
    }
  }, [uri]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <WebView
          source={{ uri }}
          allowFileAccess
          originWhitelist={['*']}
          style={styles.webview}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loader}> 
              <ActivityIndicator size="large" color={accent} />
            </View>
          )}
        />
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#11182c" /> : <Text style={styles.saveText}>Save</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]} onPress={handleShare} disabled={sharing}>
            {sharing ? <ActivityIndicator color="#fff" /> : <Text style={styles.shareText}>Share</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1224' },
  container: { flex: 1, backgroundColor: '#0b1224' },
  webview: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actionsRow: { flexDirection: 'row', padding: 12, gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtn: { backgroundColor: '#e2e8f0' },
  shareBtn: { backgroundColor: accent },
  saveText: { color: '#0b1224', fontWeight: '700' },
  shareText: { color: '#f8fafc', fontWeight: '700' },
});

export default PdfPreviewScreen;
