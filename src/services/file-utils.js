import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Convert a Blob to a Base64 string (without the data URL prefix)
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Create a ZIP file from extracted assets
export const createZip = async (photos, icons, aiEnabled) => {
  const zip = new JSZip();

  // Create folders
  const photosFolder = zip.folder("photos");
  const photosMetaFolder = zip.folder("photos_metadata");
  const iconsFolder = zip.folder("icons");
  const iconsMetaFolder = zip.folder("icons_metadata");

  // Add Photos and Metadata
  photos.forEach(p => {
    photosFolder.file(p.fileName, p.blob);
    const metaData = {
      original_extraction_name: p.originalName || p.fileName,
      current_filename: p.fileName,
      source_page: p.source_page,
      width: p.w,
      height: p.h,
      ai_model: aiEnabled ? "Gemini 2.5 Flash" : "None",
      ai_description_rag_ready: p.aiData?.description || "No description generated",
      ai_tags: p.aiData?.tags || [],
      ai_full_analysis: p.aiData || null
    };
    photosMetaFolder.file(p.fileName.replace('.jpg', '.json'), JSON.stringify(metaData, null, 2));
  });

  // Add Icons and Metadata
  icons.forEach(i => {
    iconsFolder.file(i.fileName, i.blob);
    const metaData = {
      filename: i.fileName,
      source_page: i.source_page,
      width: i.w,
      height: i.h
    };
    iconsMetaFolder.file(i.fileName.replace(/\.(png|jpg)/, '.json'), JSON.stringify(metaData, null, 2));
  });

  // Generate the ZIP blob
  const content = await zip.generateAsync({ type: "blob" });
  return content;
};

// Trigger a download of the Blob
export const downloadBlob = (blob, filename) => {
  saveAs(blob, filename);
};
