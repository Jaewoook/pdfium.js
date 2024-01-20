import createPDFiumModule from "./libs/pdfium";
import type { FPDF } from "./global";
import * as memory from "./memory";

/**
 * Emscripten module options type definition.
 */
interface ModuleOptions {
  [key: string]: unknown;
  printErr: (message: string) => void;
  onAbort: () => void;
}

interface LibraryOptions {
  onError?: () => void;
  debug?: boolean;
}

const generateModule = (options: LibraryOptions): ModuleOptions => {
  return {
    printErr: (err: string) => {
      console.error("[PDFium Error]", err);
    },
    onAbort: () => {
      console.error("Failed to load PDFium module.");
      options.onError?.();
    },
  };
};

/**
 * Create PDFium wasm module with options.
 *
 * @param options module creation options
 */
const createPDFium = (options: LibraryOptions) => {
  const { onError, debug = false } = options;

  return new Promise<FPDF>((resolve, reject) => {
    if (debug) {
      console.log("[PDFium debug] createPDFium", options);
    }

    const Module = generateModule({ onError, debug });

    createPDFiumModule(Module)
      .then((FPDFModule) => {
        // register PDFium module to window
        window.FPDF = FPDFModule;
        resolve(FPDFModule);
      })
      .catch((err) => reject(err));
  });
};

const PDFium = (options: LibraryOptions = {}) => {
  if (window.FPDF) {
    return Promise.resolve(window.FPDF);
  }

  return createPDFium(options);
};

export * from "./constants";
export { createPDFium, FPDF, PDFium, memory };
export default PDFium;
