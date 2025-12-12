import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useImageStore } from "../store/imageStore";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const resetAll = useImageStore((s) => s.resetAll);

  const startFlow = () => {
    resetAll();
    navigation.navigate("ImagePicker");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>PixaDoc</Text>
        <Text style={styles.sub}>Offline Image → PDF</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create a PDF</Text>
        <Text style={styles.desc}>Pick, edit, reorder, and export a crisp PDF without internet.</Text>
        <Pressable style={styles.primary} onPress={startFlow}>
          <Text style={styles.primaryText}>Start</Text>
        </Pressable>
      </View>

      <Pressable style={styles.secondary} onPress={() => navigation.navigate("Settings")}> 
        <Text style={styles.secondaryText}>Settings & App Info</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: "#e2e8f0",
  },
  sub: {
    color: "#94a3b8",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#0b1220",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 6,
  },
  desc: {
    color: "#94a3b8",
    marginBottom: 16,
  },
  primary: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#e2e8f0",
    fontWeight: "800",
    fontSize: 16,
  },
  secondary: {
    alignItems: "center",
    padding: 12,
  },
  secondaryText: {
    color: "#38bdf8",
    fontWeight: "700",
  },
});
