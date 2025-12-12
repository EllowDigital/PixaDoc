import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CropModal from "../components/CropModal";
import RotateButton from "../components/RotateButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { cropImage, rotateImage } from "../services/imageService";
import { useImageStore } from "../store/imageStore";

export default function ImageEditorScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const images = useImageStore((s) => s.editedImages);
  const setEditedImages = useImageStore((s) => s.setEditedImages);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [cropVisible, setCropVisible] = useState(false);

  useEffect(() => {
    if (!images.length) {
      navigation.replace("ImagePicker");
    }
  }, [images.length, navigation]);

  const current = images[index];

  const updateImage = (imgUri: string, width?: number, height?: number) => {
    const updated = images.map((item, i) =>
      i === index ? { ...item, uri: imgUri, width, height } : item,
    );
    setEditedImages(updated);
  };

  const handleRotate = async (direction: "left" | "right") => {
    if (!current) return;
    try {
      setBusy(true);
      const edited = await rotateImage(current, direction);
      updateImage(edited.uri, edited.width, edited.height);
    } catch (err) {
      Alert.alert("Rotate failed", (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleCrop = async (inset: number) => {
    if (!current) return;
    try {
      setBusy(true);
      const edited = await cropImage(current, inset);
      updateImage(edited.uri, edited.width, edited.height);
    } catch (err) {
      Alert.alert("Crop failed", (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const next = () => setIndex((prev) => Math.min(prev + 1, images.length - 1));
  const prev = () => setIndex((prev) => Math.max(prev - 1, 0));

  const goReorder = () => navigation.navigate("ImageReorder");

  return (
    <View style={styles.container}>
      {current ? (
        <>
          <View style={styles.previewBox}>
            {busy && (
              <ActivityIndicator color="#38bdf8" style={styles.loader} />
            )}
            <Image
              source={{ uri: current.uri }}
              style={styles.preview}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.counter}>
            Image {index + 1} of {images.length}
          </Text>
          <View style={styles.controls}>
            <RotateButton
              direction="left"
              onPress={() => handleRotate("left")}
            />
            <RotateButton
              direction="right"
              onPress={() => handleRotate("right")}
            />
          </View>
          <Pressable
            style={styles.secondary}
            onPress={() => setCropVisible(true)}
          >
            <Text style={styles.secondaryText}>Crop</Text>
          </Pressable>
          <View style={styles.navRow}>
            <Pressable
              style={[styles.navButton, index === 0 && styles.disabled]}
              onPress={prev}
              disabled={index === 0}
            >
              <Text style={styles.navText}>Prev</Text>
            </Pressable>
            <Pressable
              style={[
                styles.navButton,
                index === images.length - 1 && styles.disabled,
              ]}
              onPress={next}
              disabled={index === images.length - 1}
            >
              <Text style={styles.navText}>Next</Text>
            </Pressable>
          </View>
          <Pressable style={styles.primary} onPress={goReorder}>
            <Text style={styles.primaryText}>Reorder images</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.empty}>No images selected.</Text>
      )}
      <CropModal
        visible={cropVisible}
        onClose={() => setCropVisible(false)}
        onConfirm={handleCrop}
      />
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
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
  },
  counter: {
    color: "#e2e8f0",
    fontWeight: "700",
    marginBottom: 10,
  },
  controls: {
    flexDirection: "row",
    marginBottom: 12,
  },
  secondary: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "center",
  },
  navText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  primary: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryText: {
    color: "#0b1220",
    fontWeight: "800",
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 50,
  },
  disabled: {
    opacity: 0.4,
  },
});
