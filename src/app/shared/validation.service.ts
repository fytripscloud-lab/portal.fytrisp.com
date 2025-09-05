import { Injectable } from '@angular/core';

export interface FileValidationResult {
  isValid: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private readonly SUPPORTED_FORMATS = new Set([
    'JPEG', 'JPG', 'PNG', 'GIF', 'BMP', 
    'TIFF', 'TIF', 'WEBP', 'HEIC', 'HEIF', 
    'AVIF', 'EPS'
   ]);

   private readonly MIME_TYPES = new Map([
    ['JPEG', 'image/jpeg'],
    ['JPG', 'image/jpeg'],
    ['PNG', 'image/png'],
    ['GIF', 'image/gif'],
    ['BMP', 'image/bmp'],
    ['TIFF', 'image/tiff'],
    ['TIF', 'image/tiff'],
    ['WEBP', 'image/webp'],
    ['HEIC', 'image/heic'],
    ['HEIF', 'image/heif'],
    ['AVIF', 'image/avif'],
    ['EPS', 'application/postscript']
  ]);
  
  validateImageFile(file: File, maxSizeInMB: number = 2): FileValidationResult {
    if (!file) {
        return {
          isValid: false,
          message: 'No file selected'
        };
    }
    
    // Get file extension
    const fileName = file.name.toUpperCase();
    const fileExtension = fileName.split('.').pop() || '';

    // Check if extension is supported
    if (!this.SUPPORTED_FORMATS.has(fileExtension)) {
      return {
        isValid: false,
        message: `Unsupported file format. Supported formats are: ${Array.from(this.SUPPORTED_FORMATS).join(', ')}`
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        message: `File size must be less than ${maxSizeInMB}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      };
    }

    // Check MIME type
    const expectedMimeType = this.MIME_TYPES.get(fileExtension);
    if (expectedMimeType && !file.type.toLowerCase().startsWith(expectedMimeType.toLowerCase())) {
      return {
        isValid: false,
        message: 'Invalid file type or corrupted image file'
      };
    }

    return {
      isValid: true
    };
  }

  validateMultipleImageFiles(files: FileList, maxSizeInMB: number = 2): FileValidationResult[] {
    return Array.from(files).map(file => this.validateImageFile(file, maxSizeInMB));
  }
}