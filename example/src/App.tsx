import { useEffect } from "react";
import { PDFium } from "pdfium.js";
import "./App.css";

const App = () => {
  const handlePDFiumError = () => {
    console.log("[PDFium] An error occurred!");
  };

  useEffect(() => {
    PDFium({ wasmPath: "/", onError: handlePDFiumError })
      .then((PDFiumModule) => {
        console.log("PDFium WebAssembly loaded", PDFiumModule);
      })
      .catch((err) => {
        console.log("ERROR");
        console.error(err);
      });

    PDFium()
      .then((module) => {
        console.log(module.HEAP16);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <h1>PDFium.js Example</h1>

      <p>You can test PDFium module in this page.</p>
    </>
  );
};

export default App;
