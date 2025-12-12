import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { RootStackParamList } from "../navigation/AppNavigator";
import { savePdfToLibrary, sharePdf } from "../services/fileService";
import { useImageStore } from "../store/imageStore";

export default function SaveAndShareScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pdfPath = useImageStore((s) => s.generatedPdfPath);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!pdfPath) {
      navigation.replace("PdfPreview");
    }
  }, [pdfPath, navigation]);

  const handleSave = async () => {
    if (!pdfPath) return;
    try {
      setBusy(true);
      await savePdfToLibrary(pdfPath);
      Alert.alert("Saved", "PDF added to your library");
    } catch (err) {
      Alert.alert("Save failed", (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (!pdfPath) return;
    try {
      setBusy(true);
      await sharePdf(pdfPath);
    } catch (err) {
      Alert.alert("Share failed", (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>PDF ready</Text>
      <Text style={styles.path}>{pdfPath}</Text>
      <Pressable
        style={[styles.primary, busy && styles.disabled]}
        onPress={handleSave}
        disabled={busy}
      >
        <Text style={styles.primaryText}>
          {busy ? "Working..." : "Save to device"}
        </Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={handleShare} disabled={busy}>
        <Text style={styles.secondaryText}>Share</Text>
      </Pressable>
      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.linkText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  label: {
    color: "#e2e8f0",
    fontWeight: "700",
    marginBottom: 6,
  },
  path: {
    color: "#94a3b8",
    marginBottom: 18,
  },
  primary: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: {
    color: "#0b1220",
    fontWeight: "800",
  },
  secondary: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  secondaryText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  link: {
    alignItems: "center",
  },
  linkText: {
    color: "#38bdf8",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
