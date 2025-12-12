import "react-native-gesture-handler";
import "react-native-reanimated";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import AppNavigator from "./navigation/AppNavigator";

const Light = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0f172a",
    card: "#0b1220",
    text: "#e2e8f0",
    border: "#1e293b",
    primary: "#38bdf8",
  },
};

const Dark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0b1220",
    card: "#0f172a",
    text: "#e2e8f0",
    border: "#1e293b",
    primary: "#38bdf8",
  },
};

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? Dark : Light}>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
