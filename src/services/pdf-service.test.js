import { describe, it, expect, vi } from 'vitest';

// Mock pdfjs-dist to prevent loading the real library which requires full browser environment or Canvas
vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: ''
  },
  version: '1.0.0'
}));

// We need to import AFTER mocking
import { isPhotoCheck } from './pdf-service';

describe('PDF Service Logic', () => {
  describe('isPhotoCheck', () => {
    it('should identify large dimensions as photo', () => {
      // Width > 200
      expect(isPhotoCheck(201, 50, 100)).toBe(true);
      // Height > 200
      expect(isPhotoCheck(50, 201, 100)).toBe(true);
    });

    it('should identify large file size as photo', () => {
      // Size > 5000 bytes
      expect(isPhotoCheck(10, 10, 5001)).toBe(true);
    });

    it('should identify medium dimensions with medium size as photo', () => {
      // w >= 80, h >= 80, size > 500
      expect(isPhotoCheck(80, 80, 501)).toBe(true);
    });

    it('should identify small images as icons', () => {
      // Small dimensions, small size
      expect(isPhotoCheck(50, 50, 400)).toBe(false);
    });

    it('should identify medium dimensions but small size as icon', () => {
        // w >= 80, h >= 80 but size <= 500
        expect(isPhotoCheck(80, 80, 500)).toBe(false);
    });
  });
});
