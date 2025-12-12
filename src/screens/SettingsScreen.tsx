import { Linking, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PixaDoc</Text>
      <Text style={styles.text}>Offline image to PDF conversion. No cloud, no tracking.</Text>
      <Text style={styles.label}>Version</Text>
      <Text style={styles.text}>1.0.0</Text>
      <Text style={styles.label}>Support</Text>
      <Text style={styles.link} onPress={() => Linking.openURL("mailto:support@pixadoc.app")}>support@pixadoc.app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  title: {
    color: "#e2e8f0",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  text: {
    color: "#94a3b8",
    marginBottom: 12,
  },
  label: {
    color: "#cbd5e1",
    fontWeight: "700",
    marginTop: 10,
  },
  link: {
    color: "#38bdf8",
    fontWeight: "700",
  },
});
