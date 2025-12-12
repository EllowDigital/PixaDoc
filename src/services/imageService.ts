import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

import { ImageItem } from "../store/imageStore";
import { requestImagePermissions } from "../utils/permissions";

export async function pickImages(): Promise<ImageItem[]> {
  const granted = await requestImagePermissions();
  if (!granted) {
    throw new Error("Media permission denied");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    quality: 1,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    exif: true,
  });

  if (result.canceled) return [];

  return result.assets.map((asset) => ({
    id:
      asset.assetId ??
      `img-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
  }));
}

function getSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (err) => reject(err),
    );
  });
}

export async function rotateImage(
  image: ImageItem,
  direction: "left" | "right",
): Promise<ImageItem> {
  const rotation = direction === "left" ? -90 : 90;
  const manipulated = await ImageManipulator.manipulateAsync(
    image.uri,
    [{ rotate: rotation }],
    { compress: 1, format: ImageManipulator.SaveFormat.PNG },
  );

  return {
    ...image,
    uri: manipulated.uri,
    width: manipulated.width,
    height: manipulated.height,
  };
}

export async function cropImage(
  image: ImageItem,
  insetPercent: number,
): Promise<ImageItem> {
  const { width, height } =
    image.width && image.height
      ? { width: image.width, height: image.height }
      : await getSize(image.uri);
  const inset = Math.min(Math.max(insetPercent, 0), 45);
  const dx = Math.floor((width * inset) / 100);
  const dy = Math.floor((height * inset) / 100);
  const manipulated = await ImageManipulator.manipulateAsync(
    image.uri,
    [
      {
        crop: {
          originX: dx,
          originY: dy,
          width: width - dx * 2,
          height: height - dy * 2,
        },
      },
    ],
    { compress: 1, format: ImageManipulator.SaveFormat.PNG },
  );

  return {
    ...image,
    uri: manipulated.uri,
    width: manipulated.width,
    height: manipulated.height,
  };
}
