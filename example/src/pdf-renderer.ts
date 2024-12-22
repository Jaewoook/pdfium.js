import { FPDFBitmapFormat, FPDFPageOrientation, FPDFPageRenderingFlag, memory } from "pdfium.js";

const COLOR_TRANSPARENT = 0x00000000;
const COLOR_WHITE = 0xffffffff;

interface PDFFile {
  fileSize: number;
  byteArray: Uint8Array;
  allocatedMemoryPtr: number;
}

interface PDFDocument {
  opened: boolean;
  pageCount: number;
  instancePtr: number;
}

interface PDFPage {
  opened: boolean;
  rendered: boolean;
  width: number;
  height: number;
  renderWidth: number;
  renderHeight: number;
  bitmapBufferSize: number;
  instancePtr: number;
  bitmapBufferPtr: number;
  bitmapPtr: number;
}

/**
 * A class for rendering PDF file page by page.
 */
export class PDFRenderer {
  static readonly BYTES_PER_PIXEL = 4;
  static readonly MEMORY_NULLPTR = 0;
  static readonly DEFAULT_PAGE_INSTASNCE: PDFPage = {
    opened: false,
    rendered: false,
    width: 0,
    height: 0,
    renderWidth: 0,
    renderHeight: 0,
    bitmapBufferSize: PDFRenderer.MEMORY_NULLPTR,
    instancePtr: PDFRenderer.MEMORY_NULLPTR,
    bitmapBufferPtr: PDFRenderer.MEMORY_NULLPTR,
    bitmapPtr: PDFRenderer.MEMORY_NULLPTR,
  };

  file: PDFFile | null = null;
  document: PDFDocument;
  pages: PDFPage[];

  constructor(byteArray: Uint8Array | null = null) {
    if (byteArray) {
      this.file = {
        allocatedMemoryPtr: PDFRenderer.MEMORY_NULLPTR,
        byteArray,
        fileSize: byteArray.length,
      };
    }
    this.document = {
      instancePtr: PDFRenderer.MEMORY_NULLPTR,
      opened: false,
      pageCount: 0,
    };
    this.pages = [];
  }

  /**
   * Open PDF document.
   *
   * @returns The result of openDocument operation.
   * If true, the operation succeeded, otherwise it failed.
   */
  openDocument() {
    if (!this.file) {
      console.error("[PDF Renderer] openDocument: file data not set");
      return false;
    }

    if (this.document.opened) {
      console.warn("[PDF Renderer] openDocument: page already opened.");
      return false;
    }

    this.file.allocatedMemoryPtr = window.FPDF.wasmExports.malloc(this.file.fileSize);
    window.FPDF.HEAPU8.set(this.file.byteArray, this.file.allocatedMemoryPtr);
    this.document.instancePtr = window.FPDF._FPDF_LoadMemDocument(
      this.file.allocatedMemoryPtr,
      this.file.fileSize,
      ""
    );
    this.document.opened = true;

    this.document.pageCount = this.getPageCount();
    this.pages = Array.from({ length: this.document.pageCount }).map(
      () => Object.assign({}, PDFRenderer.DEFAULT_PAGE_INSTASNCE)
    );

    return true;
  }

  /**
   * Close PDF document.
   *
   * @returns The result of closeDocument operation.
   * If true, the operation succeeded, otherwise it failed.
   */
  closeDocument() {
    if (!this.file) {
      console.log("[PDF Renderer] closeDocument: file data not set");
      return false;
    }

    if (!this.document.opened) {
      console.warn("[PDF Renderer] closeDocument: page already closed.");
      return false;
    }

    // close opened page instances before close document
    this.pages.forEach((page, index) => {
      if (page.opened) {
        this.closePage(index);
      }
    });

    window.FPDF._FPDF_CloseDocument(this.document.instancePtr);
    this.document.instancePtr = PDFRenderer.MEMORY_NULLPTR;
    window.FPDF.wasmExports.free(this.file.allocatedMemoryPtr);
    this.file.allocatedMemoryPtr = PDFRenderer.MEMORY_NULLPTR;
    this.document.opened = false;

    return true;
  }

  /**
   * Open page using passed pageIndex.
   *
   * @param pageIndex The page index to open. It could start from 0.
   * @returns
   */
  openPage(pageIndex: number) {
    if (pageIndex < 0 || this.document.pageCount - 1 < pageIndex) {
      console.warn("[PDF Renderer] openPage: pageIndex out of bound.");
      return false;
    }

    if (this.pages[pageIndex].opened) {
      console.warn("[PDF Renderer] openPage: requested page already opened.");
      return false;
    }

    this.pages[pageIndex].instancePtr = window.FPDF._FPDF_LoadPage(
      this.document.instancePtr,
      pageIndex
    );
    this.pages[pageIndex].opened = true;

    return true;
  }

  closePage(pageIndex: number) {
    if (pageIndex < 0 || this.document.pageCount - 1 < pageIndex) {
      console.warn("[PDF Renderer] closePage: pageIndex out of bound.");
      return false;
    }

    if (!this.pages[pageIndex].opened) {
      return false;
    }

    this._destroyPageBitmap(this.pages[pageIndex]);
    window.FPDF._FPDF_ClosePage(this.pages[pageIndex].instancePtr);
    this.pages[pageIndex].instancePtr = PDFRenderer.MEMORY_NULLPTR;
    this.pages[pageIndex].opened = false;

    return true;
  }

  /**
   * Render and draw requested page index.
   *
   * @param targetCanvasEl render output canvas element.
   * @param pageIndex index of render requested page.
   * @param renderScale render scale factor. (default: 1.0)
   */
  render(targetCanvasEl: HTMLCanvasElement | null, pageIndex: number, renderScale: number = 1.0) {
    console.log("[PDF Renderer] render triggered!");

    console.log("[PDF Renderer] _prepareRender");
    this._prepareRender(targetCanvasEl, pageIndex, renderScale);
    console.log("[PDF Renderer] _renderToBitmap");
    this._renderToBitmap(pageIndex);
    console.log("[PDF Renderer] _drawBitmap");
    this._drawBitmap(targetCanvasEl, pageIndex);
  }

  /**
   * Get page count from opened document.
   *
   * @returns page count get from PDFium API.
   */
  getPageCount() {
    if (!this.document.opened) {
      console.warn("[PDF Renderer] _getPageCount: Document not opened!");
    }

    return window.FPDF._FPDF_GetPageCount(this.document.instancePtr);
  }

  /**
   * Measure page width and height with render scale factor.
   *
   * @param currentPage PDF page object.
   * @param renderScale render scale factor.
   * @returns measured width and height.
   */
  private _measurePageSize(currentPage: PDFPage, renderScale: number) {
    const width = Math.floor(window.FPDF._FPDF_GetPageWidth(currentPage.instancePtr) * renderScale);
    const height = Math.floor(
      window.FPDF._FPDF_GetPageHeight(currentPage.instancePtr) * renderScale
    );

    return { width, height };
  }

  /**
   * Create page bitmap instance and allocate buffer memory.
   *
   * @param page instance of PDF page.
   */
  private _createPageBitmap(page: PDFPage) {
    // allocate bitmap buffer memory using calculated bitmap buffer size
    page.bitmapBufferSize = page.width * page.height * PDFRenderer.BYTES_PER_PIXEL;
    page.bitmapBufferPtr = memory.calloc(page.width * page.height, PDFRenderer.BYTES_PER_PIXEL);

    // number of bytes for each scan line
    const stride = page.width * 4;

    // create bitmap instance using bitmap buffer memory
    page.bitmapPtr = window.FPDF._FPDFBitmap_CreateEx(
      page.width,
      page.height,
      FPDFBitmapFormat.FPDFBitmap_BGRA,
      page.bitmapBufferPtr,
      stride
    );
  }

  /**
   * Destroy page bitmap instance and deallocate memory.
   *
   * @param page instance of PDF page.
   */
  private _destroyPageBitmap(page: PDFPage) {
    if (page.bitmapPtr !== PDFRenderer.MEMORY_NULLPTR) {
      window.FPDF._FPDFBitmap_Destroy(page.bitmapPtr);
      page.bitmapPtr = PDFRenderer.MEMORY_NULLPTR;
    }

    if (page.bitmapBufferPtr !== PDFRenderer.MEMORY_NULLPTR) {
      window.FPDF.wasmExports.free(page.bitmapBufferPtr);
      page.bitmapBufferPtr = PDFRenderer.MEMORY_NULLPTR;
    }
  }

  /**
   * Prepare step for page rendering.
   * This step perform following actions:
   * 1. measure page size
   * 2. (if render size changed) destroy page bitmap
   * 3. resize output canvas element size
   * 4. create page bitmap
   *
   * @param canvasEl output canvas element.
   * @param pageIndex index of render requested page.
   * @param renderScale render scale factor.
   */
  private _prepareRender(
    canvasEl: HTMLCanvasElement | null,
    pageIndex: number,
    renderScale: number
  ) {
    if (pageIndex < 0 || this.document.pageCount - 1 < pageIndex) {
      console.warn("[PDF Renderer] _prepareRender: pageIndex out of bound.");
      return;
    }

    if (!canvasEl) {
      console.warn("[PDF Renderer] _prepareRender: canvasEl is null");
      return;
    }

    const currentPage = this.pages[pageIndex];

    if (!currentPage.opened) {
      return;
    }

    console.log("[PDF Renderer] _measurePageSize");
    const { width, height } = this._measurePageSize(currentPage, renderScale);

    // re-create bitmap buffer and bitmap instance if render size changed
    if (currentPage.width !== width || currentPage.height !== height) {
      console.log("[PDF Renderer] _destroyPageBitmap");
      this._destroyPageBitmap(currentPage);
      currentPage.width = width;
      currentPage.height = height;
    }

    console.log("[PDF Renderer] _createPageBitmap");
    this._createPageBitmap(currentPage);

    canvasEl.width = width;
    canvasEl.height = height;
  }

  /**
   * Render page content to bitmap data.
   *
   * @param pageIndex index of render requested page.
   */
  private _renderToBitmap(pageIndex: number) {
    const currentPage = this.pages[pageIndex];
    console.log(currentPage);

    const renderFlag =
      FPDFPageRenderingFlag.FPDF_REVERSE_BYTE_ORDER |
      FPDFPageRenderingFlag.FPDF_LCD_TEXT |
      FPDFPageRenderingFlag.FPDF_ANNOT;
    console.log("_FPDFBitmap_FillRect");
    window.FPDF._FPDFBitmap_FillRect(
      currentPage.bitmapPtr,
      0,
      0,
      currentPage.width,
      currentPage.height,
      COLOR_WHITE
    );
    console.log("_FPDF_RenderPageBitmap");
    window.FPDF._FPDF_RenderPageBitmap(
      currentPage.bitmapPtr,
      currentPage.instancePtr,
      0,
      0,
      currentPage.width,
      currentPage.height,
      FPDFPageOrientation.NORMAL,
      renderFlag
    );

    currentPage.rendered = true;
  }

  /**
   * Draw rendered bitmap data to output canvas.
   *
   * @param canvasEl output canvas element.
   * @param pageIndex index of render requested page.
   * @returns void type promise object.
   */
  private async _drawBitmap(canvasEl: HTMLCanvasElement | null, pageIndex: number) {
    const context = canvasEl?.getContext("2d");

    if (!canvasEl || !context) {
      console.warn("[PDF Renderer] canvas element is null.");
      return;
    }

    const currentPage = this.pages[pageIndex];
    const width = currentPage.width;
    const height = currentPage.height;

    const renderedImageData = context.createImageData(width, height);
    renderedImageData.data.set(
      window.FPDF.HEAPU8.subarray(
        currentPage.bitmapBufferPtr,
        currentPage.bitmapBufferPtr + currentPage.bitmapBufferSize
      )
    );
    const renderedBitmap = await createImageBitmap(renderedImageData);
    context.drawImage(renderedBitmap, 0, 0, width, height);
    // context.putImageData(imageData, 0, 0);
  }
}
