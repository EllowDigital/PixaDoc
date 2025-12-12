import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { ImageItem } from '../store/imageStore';

const PDF_DIR = `${FileSystem.documentDirectory ?? FileSystem.cacheDirectory}pixadoc/`;

const ensureDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PDF_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PDF_DIR, { intermediates: true });
  }
};

const imageToBase64 = async (uri: string) => {
  return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
};

const buildHtml = (base64Images: string[]) => {
  const pages = base64Images
    .map(
      (b64, index) => `
        <div class="page" aria-label="Page ${index + 1}">
          <img src="data:image/jpeg;base64,${b64}" />
        </div>
      `,
    )
    .join('');

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          .page { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 16px; }
          img { width: 100%; height: auto; object-fit: contain; }
        </style>
      </head>
      <body>
        ${pages}
      </body>
    </html>
  `;
};

export const generatePdfFromImages = async (images: ImageItem[]): Promise<string> => {
  if (!images.length) throw new Error('No images to generate PDF');

  await ensureDir();
  const base64Images = await Promise.all(images.map((img) => imageToBase64(img.uri)));
  const html = buildHtml(base64Images);

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const target = `${PDF_DIR}pixadoc-${Date.now()}.pdf`;
  await FileSystem.moveAsync({ from: uri, to: target });
  return target;
};
