import PDFiumModule from "./libs/pdfium";
import type { FPDF } from "./global";

window.PDFiumModule = PDFiumModule;

/**
 * Emscripten module options type definition
 */
interface ModuleOptions {
  [key: string]: unknown;
  printErr: (message: string) => void;
  onAbort: () => void;
  locateFile: (path: string, prefix: string) => string;
}

interface LibraryInitOptions {
  wasmPath?: string;
  onError?: () => void;
  debug?: boolean;
}

const generateModuleWithOptions = (options: LibraryInitOptions): ModuleOptions => {
  return {
    printErr: (err: string) => {
      console.error("[PDFium Error]", err);
    },
    onAbort: () => {
      console.error("Failed to load PDFium module.");
      options.onError?.();
    },
    locateFile: (path, prefix) => {
      return options.wasmPath + prefix + path;
    },
  };
};

/**
 * Initialize PDFium with options.
 *
 * `wasmPath` is required to load `.wasm` file as static asset.
 * `onWasmLoaded` is optional callback function that called when wasm load finished.
 * @param options library initialize options
 */
const initPDFium = (options: LibraryInitOptions) => {
  const { onError, wasmPath = "/", debug = false } = options;
  return new Promise<FPDF>((resolve, reject) => {
    if (debug) {
      console.log("[PDFium debug] initPDFium", options);
    }

    const Module = generateModuleWithOptions({ onError, wasmPath, debug });

    PDFiumModule(Module)
      .then((FPDFModule) => {
        // register PDFium module to window
        window.FPDF = FPDFModule;
        resolve(FPDFModule);
      })
      .catch((err) => reject(err));
  });
};

const PDFium = (options: LibraryInitOptions) => {
  if (window.FPDF) {
    return Promise.resolve(window.FPDF);
  }

  return initPDFium(options);
};

export * from "./constants";
export { initPDFium, PDFium };
export default PDFium;
