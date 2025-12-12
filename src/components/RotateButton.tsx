import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  direction: "left" | "right";
  onPress: () => void;
};

export default function RotateButton({ direction, onPress }: Props) {
  const label = direction === "left" ? "⟲ Rotate" : "⟳ Rotate";
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "#1d4ed8",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
});
