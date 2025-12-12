import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  uri: string;
  label?: string;
  onPress?: () => void;
  onRemove?: () => void;
};

export default function ImageCard({ uri, label, onPress, onRemove }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      {label ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{label}</Text>
        </View>
      ) : null}
      {onRemove ? (
        <Pressable style={styles.remove} onPress={onRemove} hitSlop={12}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginVertical: 8,
    backgroundColor: "#0f172a",
  },
  image: {
    width: "100%",
    height: 200,
  },
  badge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  remove: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  removeText: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: "700",
  },
});
