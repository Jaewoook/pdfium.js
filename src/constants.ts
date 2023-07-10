/**
 * Device-independent bitmap(DIB) formats
 */
export enum FPDFBitmapFormat {
  // Unknown or unsupported format.
  FPDFBitmap_Unknown = 0,
  // Gray scale bitmap, one byte per pixel.
  FPDFBitmap_Gray = 1,
  // 3 bytes per pixel, byte order: blue, green, red.
  FPDFBitmap_BGR = 2,
  // 4 bytes per pixel, byte order: blue, green, red, unused.
  FPDFBitmap_BGRx = 3,
  // 4 bytes per pixel, byte order: blue, green, red, alpha.
  FPDFBitmap_BGRA = 4,
}

/**
 * Page rendering flags. They can be combined with bit-wise OR.
 */
export enum FPDFPageRenderingFlag {
  // Set if annotations are to be rendered.
  FPDF_ANNOT = 0x01,
  // Set if using text rendering optimized for LCD display. This flag will only
  // take effect if anti-aliasing is enabled for text.
  FPDF_LCD_TEXT = 0x02,
  // Don't use the native text output available on some platforms
  FPDF_NO_NATIVETEXT = 0x04,
  // Grayscale output.
  FPDF_GRAYSCALE = 0x08,
  // Obsolete, has no effect, retained for compatibility.
  FPDF_DEBUG_INFO = 0x80,
  // Obsolete, has no effect, retained for compatibility.
  FPDF_NO_CATCH = 0x100,
  // Limit image cache size.
  FPDF_RENDER_LIMITEDIMAGECACHE = 0x200,
  // Always use halftone for image stretching.
  FPDF_RENDER_FORCEHALFTONE = 0x400,
  // Render for printing.
  FPDF_PRINTING = 0x800,
  // Set to disable anti-aliasing on text. This flag will also disable LCD
  // optimization for text rendering.
  FPDF_RENDER_NO_SMOOTHTEXT = 0x1000,
  // Set to disable anti-aliasing on images.
  FPDF_RENDER_NO_SMOOTHIMAGE = 0x2000,
  // Set to disable anti-aliasing on paths.
  FPDF_RENDER_NO_SMOOTHPATH = 0x4000,
  // Set whether to render in a reverse Byte order, this flag is only used when
  // rendering to a bitmap.
  FPDF_REVERSE_BYTE_ORDER = 0x10,
  // Set whether fill paths need to be stroked. This flag is only used when
  // FPDF_COLORSCHEME is passed in, since with a single fill color for paths the
  // boundaries of adjacent fill paths are less visible.
  FPDF_CONVERT_FILL_TO_STROKE = 0x20,
}

export enum FPDFError {
  // No error.
  FPDF_ERR_SUCCESS = 0,
  // Unknown error.
  FPDF_ERR_UNKNOWN = 1,
  // File not found or could not be opened.
  FPDF_ERR_FILE = 2,
  // File not in PDF format or corrupted.
  FPDF_ERR_FORMAT = 3,
  // Password required or incorrect password.
  FPDF_ERR_PASSWORD = 4,
  // Unsupported security scheme.
  FPDF_ERR_SECURITY = 5,
  // Page not found or content error.
  FPDF_ERR_PAGE = 6,
}

export enum FPDFPageOrientation {
  // 0 (normal)
  NORMAL = 0,
  // 1 (rotated 90 degrees clockwise)
  DEG90 = 1,
  // 2 (rotated 180 degrees)
  DEG180 = 2,
  // 3 (rotated 90 degrees counter-clockwise)
  DEG270 = 3,
}
