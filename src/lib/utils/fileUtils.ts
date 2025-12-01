/**
 * ByteBox - File Upload Utilities
 * Made with ❤️ by Pink Pixel
 */

'use client';

// Minimal type definitions for the subset of pdf-parse we rely on.
type PdfParseResult = { text?: string } | undefined;

interface PdfParserInstance {
  getText: () => Promise<PdfParseResult>;
  destroy: () => Promise<void>;
}

interface PdfParseConstructor {
  new (options: { data: Buffer; verbosity?: number }): PdfParserInstance;
  setWorker?: (workerUrl: string) => void;
}

type PdfParseModule = {
  PDFParse?: PdfParseConstructor;
};

// Lazy load pdf-parse only when needed (client-side only)
let pdfParse: PdfParseConstructor | null = null;
let workerConfigured = false;

const loadPdfParse = async (): Promise<PdfParseConstructor> => {
  if (!pdfParse) {
    try {
      // Dynamic import - pdf-parse v2.4.5+ uses ESM with named exports
      const pdfParseLib = (await import('pdf-parse')) as PdfParseModule;
      
      // Use the PDFParse class (named export)
      pdfParse = pdfParseLib.PDFParse ?? null;
      if (!pdfParse) {
        throw new Error('PDFParse export not found in pdf-parse module');
      }
      
      // Configure PDF.js worker (only once)
      if (!workerConfigured) {
        // Use closest available CDN version (5.4.149 vs 5.4.296 in pdf-parse)
        // NOTE: Exact version match not available on CDN, using closest stable version
        // If this causes issues, we'll need to bundle the worker locally
        pdfParse.setWorker?.('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs');
        workerConfigured = true;
      }
    } catch (error) {
      console.error('Failed to load pdf-parse:', error);
      throw new Error('PDF parsing library failed to load');
    }
  }
  if (!pdfParse) {
    throw new Error('PDF parsing library failed to initialize');
  }
  return pdfParse;
};

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  markdown: ['text/markdown', 'text/x-markdown', 'text/plain'],
  pdf: ['application/pdf'],
} as const;

// File size limits (in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface ProcessedFile {
  base64: string;
  extractedText: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

/**
 * Validate file type and size
 */
export function validateDocFile(file: File): FileValidationResult {
  // Check file type
  const allSupportedTypes: readonly string[] = [
    ...SUPPORTED_FILE_TYPES.markdown,
    ...SUPPORTED_FILE_TYPES.pdf,
  ];

  if (!allSupportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type. Please upload a Markdown (.md) or PDF (.pdf) file.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }

  // Check if file name has correct extension
  const fileName = file.name.toLowerCase();
  const isPdf = fileName.endsWith('.pdf');
  const isMarkdown = fileName.endsWith('.md') || fileName.endsWith('.markdown');

  if (!isPdf && !isMarkdown) {
    return {
      valid: false,
      error: 'Invalid file extension. Use .md or .pdf files.',
    };
  }

  return { valid: true };
}

/**
 * Extract text from PDF file
 */
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const PDFParse = await loadPdfParse();
    const nodeBuffer = Buffer.from(buffer);
    
    // PDFParse constructor requires LoadParameters with data field
    const parser = new PDFParse({
      data: nodeBuffer,
      verbosity: 0 // 0 = errors only (quietest)
    });
    
    // Use getText() method to extract all text
    const result = await parser.getText();
    
    // TextResult has a 'text' property with all extracted text
    const extractedText = result?.text || '';
    
    // Clean up parser
    await parser.destroy();
    
    return extractedText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    // Return empty string as fallback - user can still manually enter content
    return '';
  }
}

/**
 * Extract text from Markdown file
 */
async function extractMarkdownText(buffer: ArrayBuffer): Promise<string> {
  try {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer);
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return '';
  }
}

/**
 * Convert file to base64 and extract text
 */
export async function processDocFile(file: File): Promise<ProcessedFile> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Convert to base64
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  // Extract text based on file type
  let extractedText = '';
  if (file.type === 'application/pdf') {
    extractedText = await extractPdfText(arrayBuffer);
  } else {
    extractedText = await extractMarkdownText(arrayBuffer);
  }

  return {
    base64: dataUrl,
    extractedText,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
}

/**
 * Download file from base64 data
 */
export function downloadFile(base64Data: string, fileName: string) {
  try {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file icon/emoji based on type
 */
export function getFileIcon(fileType: string): string {
  if (fileType === 'application/pdf') return '📕';
  if ((SUPPORTED_FILE_TYPES.markdown as readonly string[]).includes(fileType)) return '📝';
  return '📄';
}
