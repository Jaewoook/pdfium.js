<h1 align="center">PDFium.js</h1>

<div align="center">

A PDFium wrapper library for browser-side JavaScript

[![CI Status][github-action-image]][github-action-url] [![NPM Version][npm-version-image]][npm-version-url] [![PDFium Version][pdfium-version-image]][pdfium-version-url] [![License][license-image]][license-url]

[github-action-image]: https://img.shields.io/github/actions/workflow/status/Jaewoook/pdfium.js/ci.yml?style=for-the-badge
[github-action-url]: https://github.com/Jaewoook/pdfium.js/actions/workflows/ci.yml
[npm-version-image]: https://img.shields.io/npm/v/pdfium.js?style=for-the-badge
[npm-version-url]: https://www.npmjs.com/package/pdfium.js
[pdfium-version-image]: https://img.shields.io/badge/dynamic/json?style=for-the-badge&url=https%3A%2F%2Fraw.githubusercontent.com%2FJaewoook%2Fpdfium.js%2Fmain%2Fpdfium-version.json&query=%24.pdfium&label=pdfium
[pdfium-version-url]: https://github.com/Jaewoook/pdfium.js/blob/main/pdfium-version.json
[license-image]: https://img.shields.io/github/license/Jaewoook/pdfium.js?style=for-the-badge
[license-url]: https://github.com/Jaewoook/pdfium.js/blob/main/LICENSE

</div>

## Getting Started

### Installation

```bash
yarn add pdfium.js
```

```bash
npm install --save pdfium.js
```

### Copy pdfium.wasm file

| :warning: This is required step to use PDFium! Copy bundled pdfium.wasm file to your static assets directory

```bash
cp ./node_modules/pdfium.js/dist/pdfium.wasm <YOUR_STATIC_ASSETS_DIRECTORY>
```

## Usage

### Initialize the PDFium module

```ts
import { PDFium } from "pdfium.js";

// load or initialize PDFium
PDFium({ wasmPath: "/" }).then((PDFiumModule) => {
  // call PDFium InitLibrary function after module loaded
  PDFiumModule._FPDF_InitLibrary();
});
```

### Memory Management

```ts
import { PDFium } from "pdfium.js";

// options parameter can be skipped after the module loaded
PDFium().then((PDFiumModule) => {
  const bytes = 1024;

  // allocate 1024 bytes in memory
  const memoryAddress = PDFiumModule.asm.malloc(bytes);

  // free memory
  PDFiumModule.asm.free(memoryAddress);
});
```

## API

Supported PDFium API List ([source code](./src/global.d.ts))

| Name |
|------|
| _PDFium_Init |
| _FPDF_InitLibrary |
| _FPDF_InitLibraryWithConfig |
| _FPDF_DestroyLibrary |
| _FPDF_GetLastError |
| _FPDF_LoadDocument |
| _FPDF_LoadMemDocument |
| _FPDF_CloseDocument |
| _FPDF_GetPageCount |
| _FPDF_LoadPage |
| _FPDF_GetPageWidth |
| _FPDF_GetPageHeight |
| _FPDF_GetPageWidthF |
| _FPDF_GetPageHeightF |
| _FPDF_GetPageSizeByIndex |
| _FPDF_ClosePage |  
| _FPDFPage_CountObjects |
| _FPDFPage_GetObject |
| _FPDFPage_GenerateContent |
| _FPDFPageObj_Destroy |
| _FPDFText_LoadPage |
| _FPDFText_CountChars |
| _FPDFText_GetCharBox |
| _FPDFText_ClosePage |
| _FPDFBitmap_Create |
| _FPDFBitmap_CreateEx |
| _FPDFBitmap_FillRect |
| _FPDF_RenderPageBitmap |
| _FPDFBitmap_Destroy |
| _FPDF_DeviceToPage |
| _FPDF_PageToDevice |


## Author

- Jaewook Ahn

## License

This project is licensed under the [MIT License](./LICENSE).
