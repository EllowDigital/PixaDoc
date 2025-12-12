import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import ImagePickerScreen from "../screens/ImagePickerScreen";
import ImageEditorScreen from "../screens/ImageEditorScreen";
import ImageReorderScreen from "../screens/ImageReorderScreen";
import PdfPreviewScreen from "../screens/PdfPreviewScreen";
import SaveAndShareScreen from "../screens/SaveAndShareScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  ImagePicker: undefined;
  ImageEditor: undefined;
  ImageReorder: undefined;
  PdfPreview: undefined;
  SaveAndShare: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ImagePicker" component={ImagePickerScreen} options={{ title: "Pick Images" }} />
      <Stack.Screen name="ImageEditor" component={ImageEditorScreen} options={{ title: "Edit Images" }} />
      <Stack.Screen name="ImageReorder" component={ImageReorderScreen} options={{ title: "Reorder" }} />
      <Stack.Screen name="PdfPreview" component={PdfPreviewScreen} options={{ title: "PDF Preview" }} />
      <Stack.Screen name="SaveAndShare" component={SaveAndShareScreen} options={{ title: "Save & Share" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}
