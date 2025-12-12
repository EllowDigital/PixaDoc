import { create } from 'zustand';

export type ImageItem = {
  id: string;
  uri: string;
  width: number;
  height: number;
};

export type PdfInfo = {
  uri: string;
};

type ImageStoreState = {
  images: ImageItem[];
  pdfPath?: string;
  addImages: (payload: { uri: string; width?: number; height?: number }[]) => void;
  updateImage: (id: string, updater: Partial<ImageItem>) => void;
  reorderImages: (nextOrder: ImageItem[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  setPdfPath: (uri?: string) => void;
};

export const useImageStore = create<ImageStoreState>((set) => ({
  images: [],
  pdfPath: undefined,
  addImages: (payload) =>
    set((state) => ({
      images: [
        ...state.images,
        ...payload.map((item) => ({
          id: createId(),
          uri: item.uri,
          width: item.width ?? 0,
          height: item.height ?? 0,
        })),
      ],
    })),
  updateImage: (id, updater) =>
    set((state) => ({
      images: state.images.map((img) => (img.id === id ? { ...img, ...updater } : img)),
    })),
  reorderImages: (nextOrder) => set(() => ({ images: nextOrder })),
  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),
  clearAll: () => set({ images: [], pdfPath: undefined }),
  setPdfPath: (uri) => set({ pdfPath: uri }),
}));

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
