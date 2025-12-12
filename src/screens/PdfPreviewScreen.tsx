import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import PDFView from "react-native-pdf";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useImageStore } from "../store/imageStore";
import { generatePdf } from "../services/pdfService";

export default function PdfPreviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const orderedImages = useImageStore((s) => s.orderedImages);
  const pdfPath = useImageStore((s) => s.generatedPdfPath);
  const setPdfPath = useImageStore((s) => s.setGeneratedPdfPath);
  const [loading, setLoading] = useState(false);

  const buildPdf = async () => {
    if (!orderedImages.length) {
      Alert.alert("No images", "Add images first.");
      navigation.navigate("ImagePicker");
      return;
    }
    try {
      setLoading(true);
      const path = await generatePdf(orderedImages);
      setPdfPath(path);
    } catch (err) {
      Alert.alert("PDF error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfPath) {
      buildPdf();
    }
  }, [pdfPath]);

  const goSave = () => navigation.navigate("SaveAndShare");

  return (
    <View style={styles.container}>
      <View style={styles.previewBox}>
        {loading && <ActivityIndicator color="#38bdf8" style={styles.loader} />}
        {pdfPath ? (
          <PDFView
            source={{ uri: pdfPath }}
            style={styles.pdf}
            trustAllCerts
          />
        ) : (
          <Text style={styles.placeholder}>Generating PDF...</Text>
        )}
      </View>
      <Pressable style={styles.secondary} onPress={buildPdf}>
        <Text style={styles.secondaryText}>Regenerate</Text>
      </Pressable>
      <Pressable style={styles.primary} onPress={goSave} disabled={!pdfPath}>
        <Text style={styles.primaryText}>Save & Share</Text>
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
  previewBox: {
    backgroundColor: "#0b1220",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    height: Dimensions.get("window").height * 0.65,
    overflow: "hidden",
    marginBottom: 12,
  },
  pdf: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
  },
  placeholder: {
    color: "#94a3b8",
    padding: 16,
  },
  secondary: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  primary: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#0b1220",
    fontWeight: "800",
  },
});
