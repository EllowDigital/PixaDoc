import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

import { RootStackParamList } from "../navigation/AppNavigator";
import { useImageStore, ImageItem } from "../store/imageStore";

export default function ImageReorderScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const images = useImageStore((s) => s.orderedImages);
  const setOrderedImages = useImageStore((s) => s.setOrderedImages);

  const renderItem = ({
    item,
    drag,
    isActive,
    index,
  }: RenderItemParams<ImageItem>) => (
    <Pressable
      onLongPress={drag}
      disabled={isActive}
      style={[styles.row, isActive && styles.activeRow]}
    >
      <Text style={styles.position}>#{index + 1}</Text>
      <Text numberOfLines={1} style={styles.uri}>
        {item.uri}
      </Text>
      <Text style={styles.dragHint}>⇅</Text>
    </Pressable>
  );

  const goPreview = () => {
  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<ImageItem>) => {
    const index = getIndex() ?? 0;
    return (
      <Pressable
        onLongPress={drag}
        disabled={isActive}
        style={[styles.row, isActive && styles.activeRow]}
      >
        <Text style={styles.position}>#{index + 1}</Text>
        <Text numberOfLines={1} style={styles.uri}>
          {item.uri}
        </Text>
        <Text style={styles.dragHint}>⇅</Text>
      </Pressable>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  title: {
    color: "#e2e8f0",
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b1220",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  activeRow: {
    borderColor: "#38bdf8",
  },
  position: {
    color: "#38bdf8",
    fontWeight: "800",
    marginRight: 10,
  },
  uri: {
    flex: 1,
    color: "#e2e8f0",
  },
  dragHint: {
    color: "#94a3b8",
    marginLeft: 10,
  },
  primary: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#0b1220",
    fontWeight: "800",
  },
});
