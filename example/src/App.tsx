import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { PDFium } from "pdfium.js";
import { PDFRenderer } from "./pdf-renderer";

import "react-toastify/ReactToastify.min.css";
import "./App.css";

const App = () => {
  const [isReady, setReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [targetPageIndex, setTargetPageIndex] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const pdfRenderSurfaceRef = useRef<HTMLCanvasElement>(null);
  const pdfRenderer = useRef<PDFRenderer>();

  const handlePDFiumError = () => {
    toast("[PDFium Native] An error occurred!", { type: "error", autoClose: false });
    console.log("[PDFium] An error occurred!");
  };

  const loadPDFium = async () => {
    if (isReady) {
      toast("PDFium.js already loaded", { type: "info" });
      return;
    }

    try {
      const PDFiumModule = await PDFium({ onError: handlePDFiumError });
      setReady(true);
      toast("PDFium.js loaded", { type: "success" });
      console.log("PDFium WebAssembly loaded", PDFiumModule);
    } catch (err) {
      toast(JSON.stringify(err), { type: "error", autoClose: false });
      console.error(err);
    }
  };

  const initPDFium = useCallback(() => {
    window.FPDF?._FPDF_InitLibrary();
    setInitialized(true);
  }, [initialized]);

  const destroyPDFium = useCallback(() => {
    window.FPDF?._FPDF_DestroyLibrary();
    setInitialized(false);
  }, [initialized]);

  const loadDocumentBinary = useCallback(async () => {
    if (pdfRenderer.current) {
      toast("Document already loaded!", { type: "error" });
      return;
    }

    const binaryRes = await axios.get<ArrayBuffer>("/PDF32000_2008.pdf", {
      responseType: "arraybuffer",
    });
    const binary = new Uint8Array(binaryRes.data);
    pdfRenderer.current = new PDFRenderer(binary);
    pdfRenderer.current.openDocument();
    setDocumentLoaded(true);
    setTotalPageCount(pdfRenderer.current.getPageCount());
  }, []);

  const renderDocument = useCallback(async () => {
    if (!pdfRenderer.current) {
      toast("PDF document not loaded", { type: "error" });
      return;
    }

    if (!pdfRenderer.current.openPage(targetPageIndex)) {
      toast("Failed to open target page in PDF document", { type: "error" });
      return;
    }

    pdfRenderer.current.render(pdfRenderSurfaceRef.current, targetPageIndex, 1.0);
  }, [targetPageIndex]);

  return (
    <>
      <header>
        <h1>PDFium.js Example</h1>
      </header>
      <div id="content">
        <aside>
          <p>PDFium.js loaded: {isReady ? "Yes" : "No"}</p>
          <p>WASM Library Initialized: {initialized ? "Yes" : "No"}</p>
          <p>PDF binary loaded: {documentLoaded ? "Yes" : "no"}</p>
          <hr />
          <p>Number of pages: {totalPageCount}</p>
          <div className="api-container">
            <button onClick={loadPDFium}>Load PDFium.js</button>
            <br />
            <button disabled={!isReady || initialized} onClick={initPDFium}>
              Init PDFium Native Library
            </button>
            <button disabled={!isReady || !initialized} onClick={destroyPDFium}>
              Destroy PDFium Native Library
            </button>
            <br />
            <button disabled={!isReady || documentLoaded} onClick={loadDocumentBinary}>Load document</button>
            <br />
            <label>
              Target page index:{" "}
              <input
                type="number"
                value={targetPageIndex}
                onChange={(e) => setTargetPageIndex(Number(e.target.value))}
              />
            </label>
            <button disabled={!documentLoaded} onClick={renderDocument}>Render sample document</button>
          </div>
        </aside>
        <main className="pdf-container">
          <canvas id="pdf-canvas" ref={pdfRenderSurfaceRef} width={500} />
        </main>
      </div>

      <ToastContainer position="bottom-right" theme="dark" newestOnTop />
    </>
  );
};

export default App;
