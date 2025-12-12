import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ImageCard from "../components/ImageCard";
import { RootStackParamList } from "../navigation/AppNavigator";
import { pickImages } from "../services/imageService";
import { useImageStore } from "../store/imageStore";

export default function ImagePickerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setSelectedImages = useImageStore((s) => s.setSelectedImages);
  const selectedImages = useImageStore((s) => s.selectedImages);
  const [loading, setLoading] = useState(false);

  const handlePick = async () => {
    try {
      setLoading(true);
      const images = await pickImages();
      setSelectedImages(images);
    } catch (err) {
      Alert.alert("Permission", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (!selectedImages.length) {
      Alert.alert("No images", "Select at least one image.");
      return;
    }
    navigation.navigate("ImageEditor");
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, loading && styles.disabled]}
        onPress={handlePick}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Opening gallery..." : "Select images"}
        </Text>
      </Pressable>

      <FlatList
        data={selectedImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ImageCard uri={item.uri} label={`#${index + 1}`} />
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No images yet.</Text>}
      />

      <Pressable style={styles.primary} onPress={goNext}>
        <Text style={styles.primaryText}>Edit selection</Text>
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
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.6,
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },
  primary: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryText: {
    color: "#0b1220",
    fontWeight: "800",
  },
});
