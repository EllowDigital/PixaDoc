import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { requestSavePermissions } from "../utils/permissions";

export async function savePdfToLibrary(pdfPath: string): Promise<boolean> {
  const granted = await requestSavePermissions();
  if (!granted) throw new Error("Storage permission denied");

  const asset = await MediaLibrary.createAssetAsync(pdfPath);
  const album = await MediaLibrary.getAlbumAsync("PixaDoc");
  if (album) {
    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
  } else {
    await MediaLibrary.createAlbumAsync("PixaDoc", asset, false);
  }
  return true;
}

export async function sharePdf(pdfPath: string): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error("Sharing is not available on this device");
  await Sharing.shareAsync(pdfPath, { UTI: "com.adobe.pdf", mimeType: "application/pdf" });
}

export async function deleteFileIfExists(path?: string) {
  if (!path) return;
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) {
    await FileSystem.deleteAsync(path, { idempotent: true });
  }
}
