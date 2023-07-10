import PDFiumModule from "./libs/pdfium";

interface ModuleOptions {
  [key: string]: unknown;
  print: (message: string) => void;
  printErr: (message: string) => void;
  onAbort: () => void;
  totalDependencies: number;
  setStatus: {
    (text: string): void;
    last?: {
      time: number;
      text: string;
    };
  };
  monitorRunDependencies: (left: number) => void;
}

window.PDFiumModule = PDFiumModule;
let wasmPath = "";
let onWASMLoadedCallback = () => {};

interface InitOptions {
  onError: () => void;
  resolve: (result: boolean) => void;
}

const generateModuleWithOptions = (options: Partial<InitOptions>) => {
  const Module: ModuleOptions = {
    print: (message: string) => {
      console.log("Module print:", message);
    },
    printErr: (err: string) => {
      console.error("[PDFium Error]", err);
    },
    onAbort: () => {
      console.error("Failed to load PDFium module.");
      if (options.onError) {
        options.onError();
      }
    },
    onRuntimeInitialized: () => {
      if (options.resolve) {
        options.resolve(true);
      }
      onWASMLoadedCallback();
    },
    locateFile: (path: string, prefix: string) => {
      return wasmPath + prefix + path;
    },
    // logReadFiles: true,
    totalDependencies: 0,
    setStatus: (text) => {
      if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: "" };
      if (text === Module.setStatus.last.text) return;
      const m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
      const now = Date.now();
      if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
      Module.setStatus.last.time = now;
      Module.setStatus.last.text = text;
      if (m) {
        text = m[1];
        // progressElement.value = parseInt(m[2]) * 100;
        // progressElement.max = parseInt(m[4]) * 100;
        // progressElement.hidden = false;
        // spinnerElement.hidden = false;
      } else {
        // progressElement.value = null;
        // progressElement.max = null;
        // progressElement.hidden = true;
        // if (!text) spinnerElement.style.display = "none";
      }
      // statusElement.innerHTML = text;
    },
    monitorRunDependencies: (left: number) => {
      Module.totalDependencies = Math.max(Module.totalDependencies, left);
      Module.setStatus(left ? 'Preparing... (' + (Module.totalDependencies - left) + '/' + Module.totalDependencies + ')' : 'All downloads complete.');
    },
  };

  return Module;
};

const load = (options: Partial<InitOptions> = {}) => {
  return new Promise<boolean>((resolve, reject) => {
    const Module = generateModuleWithOptions({ ...options, resolve });

    window.PDFiumModule(Module).then((FPDFModule) => {
      // register PDFium module to window
      window.FPDF = FPDFModule;
      window.Module = FPDFModule;
    }).catch((err) => reject(err));
  });
};

interface LibraryInitOptions {
  wasmPath: string;
  onWASMLoaded?: () => void;
}

/**
 * Set options to initialize library.
 *
 * `wasmPath` is required to load `.wasm` file as static asset.
 * `onWASMLoaded` is optional callback function that called when wasm load finished.
 * @param options library initialize options
 */
const initLibrary = (options: LibraryInitOptions) => {
  wasmPath = options.wasmPath;
  onWASMLoadedCallback = options.onWASMLoaded ?? (() => {});
};

export { load, initLibrary };
