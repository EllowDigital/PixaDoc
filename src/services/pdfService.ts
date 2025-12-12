import {
  documentDirectory,
  EncodingType,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
  readAsStringAsync,
} from "expo-file-system";
import * as Print from "expo-print";

import { ImageItem } from "../store/imageStore";

const OUTPUT_DIR = `${documentDirectory}pixadoc`;

async function ensureDir() {
  const dirInfo = await getInfoAsync(OUTPUT_DIR);
  if (!dirInfo.exists) {
    await makeDirectoryAsync(OUTPUT_DIR, { intermediates: true });
  }
}

async function imageToBase64(uri: string) {
  return readAsStringAsync(uri, {
    encoding: EncodingType.Base64,
  });
}

function buildHtml(imageData: { data: string; mime: string }[]) {
  const pages = imageData
    .map(
      (item, index) => `
      <div style="page-break-after: always; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a;">
        <img src="data:${item.mime};base64,${item.data}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="page-${index + 1}" />
      </div>
    `,
    )
    .join("\n");

  return `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <style>
          * { margin: 0; padding: 0; }
          body { background: #0f172a; }
        </style>
      </head>
      <body>
        ${pages}
      </body>
    </html>
  `;
}

function guessMime(uri: string): string {
  if (uri.endsWith(".png")) return "image/png";
  if (uri.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function generatePdf(images: ImageItem[]): Promise<string> {
  if (!images.length) throw new Error("No images to convert");
  await ensureDir();

  const sources = await Promise.all(
    images.map(async (img) => ({
      data: await imageToBase64(img.uri),
      mime: guessMime(img.uri),
    })),
  );

  const html = buildHtml(sources);
  const fileName = `pixadoc-${Date.now()}.pdf`;
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const dest = `${OUTPUT_DIR}/${fileName}`;
  await moveAsync({ from: uri, to: dest });
  return dest;
}
