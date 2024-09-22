import { useState } from "react";
import { PDFium } from "pdfium.js";
import "./App.css";

const App = () => {
  const [isReady, setReady] = useState(false);

  const handlePDFiumError = () => {
    console.log("[PDFium] An error occurred!");
  };

  const loadPDFium = () => {
    PDFium({ onError: handlePDFiumError })
      .then((PDFiumModule) => {
        setReady(true);
        console.log("PDFium WebAssembly loaded", PDFiumModule);
      })
      .catch((err) => {
        console.log("ERROR");
        console.error(err);
      });

  };

  return (
    <>
      <h1>PDFium.js Example</h1>
      <p>PDFium loaded: {isReady ? "Yes" : "No"}</p>
      <button onClick={loadPDFium}>Load PDFium.js</button>

    </>
  );
};

export default App;
