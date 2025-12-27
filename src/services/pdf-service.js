import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source.
// We use the ?url suffix to tell Vite to treat this import as a static asset URL
// rather than bundling the code directly into the main chunk.
// This ensures the worker runs in its own thread and is bundled locally for production.
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Helper to determine if an image is a photo or an icon
export const isPhotoCheck = (w, h, size) => {
  if (w > 200 || h > 200) return true;
  if (size > 5000) return true;
  if (w >= 80 && h >= 80 && size > 500) return true;
  return false;
};

// Core extraction logic
export const extractImagesFromPdf = async (file, useSmartExtraction, onProgress) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const totalPages = pdf.numPages;

    let collectedPhotos = [];
    let collectedIcons = [];
    let pageCounts = { photos: {}, icons: {} };

    // Function to process a single image blob
    const processImageBlob = async (blob, ext, pageIdx, w, h, method) => {
      const isPhoto = isPhotoCheck(w, h, blob.size);
      const type = isPhoto ? 'photos' : 'icons';

      if (!pageCounts[type][pageIdx]) pageCounts[type][pageIdx] = 0;
      pageCounts[type][pageIdx]++;
      const count = pageCounts[type][pageIdx];

      const baseName = `Page ${pageIdx}-${count}`;
      const fileName = isPhoto ? `${baseName}.${ext}` : `Icon_${baseName}.${ext}`;

      const item = {
        blob,
        fileName,
        w,
        h,
        source_page: pageIdx,
        originalName: fileName,
        size: blob.size,
        method
      };

      if (isPhoto) {
        collectedPhotos.push({ ...item, url: URL.createObjectURL(blob) });
      } else {
        collectedIcons.push({ ...item, url: URL.createObjectURL(blob) });
      }
    };

    if (useSmartExtraction) {
      const OPS = pdfjsLib.OPS;

      const traverseOperators = async (ops, resources, pageIndex) => {
        for (let j = 0; j < ops.fnArray.length; j++) {
            // Note: We don't have a simple cancellation token here, relying on caller to handle lifecycle
          const fn = ops.fnArray[j];
          const args = ops.argsArray[j];

          if (fn === OPS.paintJpegXObject) {
            const imgName = args[0];
            try {
              let imgInfo = null;
              try { imgInfo = await resources.get(imgName); } catch (e) { /* ignore */ }
              if (imgInfo && imgInfo.data && imgInfo.data.length > 0) {
                const blob = new Blob([imgInfo.data], { type: 'image/jpeg' });
                if (blob.size > 100) await processImageBlob(blob, 'jpg', pageIndex, imgInfo.width, imgInfo.height, 'SmartScan_JPEG_Data');
              }
            } catch (e) { /* ignore */ }
          }
          else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
            let imgName, imgInfo;
            try {
              if (fn === OPS.paintInlineImageXObject) imgInfo = args[0];
              else { imgName = args[0]; try { imgInfo = await resources.get(imgName); } catch (e) { /* ignore */ } }

              if (imgInfo) {
                const width = imgInfo.width;
                const height = imgInfo.height;
                if (width < 5 || height < 5) continue;

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                let drawn = false;

                if (imgInfo.bitmap) {
                    ctx.drawImage(imgInfo.bitmap, 0, 0, width, height);
                    drawn = true;
                }
                else if (imgInfo.data) {
                  try {
                    const imageData = new ImageData(new Uint8ClampedArray(imgInfo.data.buffer || imgInfo.data), width, height);
                    ctx.putImageData(imageData, 0, 0);
                    drawn = true;
                  } catch (err) { /* ignore */ }
                }

                if (drawn) {
                  const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                  if (blob && blob.size > 100) await processImageBlob(blob, 'png', pageIndex, width, height, 'SmartScan_BitmapRender');
                }
                canvas.remove();
              }
            } catch (e) { /* ignore */ }
          }
          else if (fn === OPS.paintFormXObject) {
            const formName = args[0];
            try {
              let form = null;
              try { form = await resources.get(formName); } catch (e) { /* ignore */ }
              if (form && form.getOperatorList) {
                const formOps = await form.getOperatorList();
                await traverseOperators(formOps, form.objs || resources, pageIndex);
              }
            } catch (e) { /* ignore */ }
          }
        }
      };

      for (let i = 1; i <= totalPages; i++) {
        const progress = Math.round(((i - 1) / totalPages) * 100);
        onProgress(progress, `Deep scanning page ${i} of ${totalPages}...`);

        try {
          const page = await pdf.getPage(i);
          const ops = await page.getOperatorList();
          await traverseOperators(ops, page.objs, i);
          page.cleanup();
        } catch (e) {
            console.error(`Error processing page ${i}`, e);
        }
      }

    } else {
      // "Convert Pages to Images" mode
      for (let i = 1; i <= totalPages; i++) {
        const progress = Math.round(((i - 1) / totalPages) * 100);
        onProgress(progress, `Converting page ${i} of ${totalPages} to image...`);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));

        if (blob) await processImageBlob(blob, 'jpg', i, canvas.width, canvas.height, 'Full_Page_Render');

        page.cleanup();
        canvas.remove();
      }
    }

    if (collectedPhotos.length === 0 && collectedIcons.length === 0) {
        throw new Error("NO_IMAGES");
    }

    return { photos: collectedPhotos, icons: collectedIcons };

  } catch (error) {
    console.error("PDF Extraction Error", error);
    throw error;
  }
};
