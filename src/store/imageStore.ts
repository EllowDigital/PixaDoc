import { create } from "zustand";

export type ImageItem = {
  id: string;
  uri: string;
  width?: number;
  height?: number;
};

type ImageState = {
  selectedImages: ImageItem[];
  editedImages: ImageItem[];
  orderedImages: ImageItem[];
  generatedPdfPath?: string;
  setSelectedImages: (images: ImageItem[]) => void;
  setEditedImages: (images: ImageItem[]) => void;
  setOrderedImages: (images: ImageItem[]) => void;
  setGeneratedPdfPath: (path?: string) => void;
  resetAll: () => void;
};

export const useImageStore = create<ImageState>((set) => ({
  selectedImages: [],
  editedImages: [],
  orderedImages: [],
  generatedPdfPath: undefined,
  setSelectedImages: (images) =>
    set({
      selectedImages: images,
      editedImages: images,
      orderedImages: images,
    }),
  setEditedImages: (images) =>
    set({ editedImages: images, orderedImages: images }),
  setOrderedImages: (images) => set({ orderedImages: images }),
  setGeneratedPdfPath: (path) => set({ generatedPdfPath: path }),
  resetAll: () =>
    set({
      selectedImages: [],
      editedImages: [],
      orderedImages: [],
      generatedPdfPath: undefined,
    }),
}));
