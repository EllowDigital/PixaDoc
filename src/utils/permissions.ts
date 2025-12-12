import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

export async function requestImagePermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted" || status === "limited";
}

export async function requestCameraPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted" || status === "limited";
}

export async function requestSavePermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === "granted" || status === "limited";
  }
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted" || status === "limited";
}
