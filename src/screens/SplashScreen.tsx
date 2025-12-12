import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { RootStackParamList } from "../navigation/AppNavigator";

export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => navigation.replace("Home"), 1000);
    return () => clearTimeout(timer);
  }, [navigation, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
        <Text style={styles.logo}>PixaDoc</Text>
      </Animated.View>
      <Text style={styles.subtitle}>Offline image to PDF</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: "#1e3a8a",
    borderRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    color: "#e2e8f0",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
});
