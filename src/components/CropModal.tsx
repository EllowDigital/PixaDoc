import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (insetPercent: number) => void;
};

export default function CropModal({ visible, onClose, onConfirm }: Props) {
  const [value, setValue] = useState("10");

  const confirm = () => {
    const num = Number(value);
    const safe = Number.isFinite(num) ? Math.min(Math.max(num, 0), 45) : 10;
    onConfirm(safe);
    onClose();
  };

  const setPreset = (num: number) => setValue(num.toString());

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Crop Inset (%)</Text>
          <Text style={styles.subtitle}>Enter how much to trim from each edge (0-45%).</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="10"
            value={value}
            onChangeText={setValue}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
          <View style={styles.row}>
            {[5, 10, 15, 20].map((n) => (
              <Pressable key={n} style={styles.pill} onPress={() => setPreset(n)}>
                <Text style={styles.pillText}>{n}%</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.secondary]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.primary]} onPress={confirm}>
              <Text style={styles.buttonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  title: {
    color: "#e2e8f0",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    color: "#e2e8f0",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pill: {
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pillText: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  primary: {
    backgroundColor: "#2563eb",
  },
  secondary: {
    backgroundColor: "#1e293b",
  },
  buttonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
});
