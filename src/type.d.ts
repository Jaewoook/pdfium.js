declare global {
  interface Window {
    PDFiumModule: (Module?: object) => Promise<FPDF>;
    Module: FPDF;
    FPDF: FPDF;
  }
}

export interface FPDF extends ModuleOptions {
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  asm: {
    [key: string]: any;
    malloc: (size: number) => number;
    free: (address: number) => number;
  };
  ccall: (identifier: string, returnType?: any, argTypes?: any, args?: any, options?: any) => any;
  cwrap: (identifier: string, returnType?: any, argTypes?: any, args?: any, options?: any) => any;
  // Library
  _PDFium_Init: () => void;
  _FPDF_InitLibrary: () => void;
  _FPDF_InitLibraryWithConfig: (...args: any) => void;
  _FPDF_DestroyLibrary: () => void;
  _FPDF_GetLastError: () => number;
  // Document
  _FPDF_LoadDocument: (...args: any) => any;
  _FPDF_LoadMemDocument: (bufferPtr: number, size: number, password: string) => number;
  _FPDF_CloseDocument: (documentPtr: number) => void;
  _FPDF_GetPageCount: (documentPtr: number) => number;
  // Page
  _FPDF_LoadPage: (documentPtr: number, index: number) => number;
  _FPDF_GetPageWidth: (pagePtr: number) => number;
  _FPDF_GetPageHeight: (pagePtr: number) => number;
  _FPDF_GetPageWidthF: (pagePtr: number) => number;
  _FPDF_GetPageHeightF: (pagePtr: number) => number;
  _FPDF_GetPageSizeByIndex: (documentPtr: number, pageIndex: number, width: number, height: number) => number;
  _FPDF_ClosePage: (pagePtr: number) => void;
  // Page Object
  _FPDFPage_CountObjects: (pagePtr: number) => number;
  _FPDFPage_GetObject: (pagePtr: number, index: number) => number;
  _FPDFPage_GenerateContent: (pagePtr: number) => boolean;
  _FPDFPageObj_Destroy: (pageObjectPtr: number) => void;
  // TextPage
  _FPDFText_LoadPage: (pagePtr: number) => number;
  _FPDFText_CountChars: (textPagePtr: number) => number;
  _FPDFText_GetCharBox: (textIndex: number) => void;
  _FPDFText_ClosePage: (textPagePtr: number) => void;
  // Bitmap
  _FPDFBitmap_Create: (width: number, height: number, alpha: number) => number;
  _FPDFBitmap_CreateEx: (width: number, height: number, format: number, firstScan: number, stride: number) => number;
  _FPDFBitmap_FillRect: (
    bitmapPtr: number,
    left: number,
    top: number,
    width: number,
    height: number,
    color: number
  ) => void;
  _FPDF_RenderPageBitmap: (
    bitmapPtr: number,
    pagePtr: number,
    startX: number,
    startY: number,
    sizeX: number,
    sizeY: number,
    rotate: number,
    flag: number
  ) => void;
  _FPDFBitmap_Destroy: (bitmap: number) => void;
  // Utils
  _FPDF_DeviceToPage: (
    pagePtr: number,
    startX: number,
    startY: number,
    sizeX: number,
    sizeY: number,
    rotate: number,
    deviceX: number,
    deviceY: number,
    pageX: number,
    pageY: number
  ) => boolean;
  _FPDF_PageToDevice: (
    pagePtr: number,
    startX: number,
    startY: number,
    sizeX: number,
    sizeY: number,
    rotate: number,
    pageX: number,
    pageY: number,
    deviceX: number,
    deviceY: number
  ) => void;
}
