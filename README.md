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

## Introduction

[PDFium](https://pdfium.googlesource.com/pdfium/+/master/README.md) is a high performance open source PDF library used in chromium. However, its implementation in C/C++ makes it challenging to use in web development. **PDFium.js** provides a pre-built WebAssembly version of the PDFium binary and offers an interface that allows it to be used in JavaScript. It will be helpful when developing PDF-related features.

## Getting Started

### Installation

```bash
yarn add pdfium.js
```

```bash
npm install --save pdfium.js
```

### WebAssembly Preparation

> [!IMPORTANT]  
> This step is required to use this library. Make sure to copy the bundled `pdfium.wasm` file to your static assets directory before using it.

```bash
cp ./node_modules/pdfium.js/dist/pdfium.wasm <YOUR_STATIC_ASSETS_DIRECTORY>
```

or you can manually download the pdfium.wasm file [here](https://github.com/Jaewoook/pdfium.js/raw/main/src/libs/pdfium.wasm).

## Usage

```ts
import { PDFium } from "pdfium.js";

PDFium({ wasmPath: "/" }).then((PDFiumModule) => {
  // library initialization
  PDFiumModule._FPDF_InitLibrary();

  // memory allocation
  const byteArray: Uint8Array = <FILE BINARY DATA>;
  const fileSize = byteArray.length;
  const binaryAddress = PDFiumModule.asm.malloc(fileSize);
  PDFiumModule.HEAPU8.set(byteArray, binaryAddress);

  // document loading
  const documentAddress = PDFiumModule._FPDF_LoadMemDocument(binaryAddress, fileSize, "");
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

## PDFium API

This library doesn't provide full PDFium API yet. Check full version of defined PDFium API type list [here](./src/global.d.ts).

You can also find original API specification [here](https://pdfium.googlesource.com/pdfium/+/main/public/).

### Supported API List
- _FPDF_InitLibrary
- _FPDF_InitLibraryWithConfig
- _FPDF_DestroyLibrary
- _FPDF_GetLastError
- _FPDF_LoadDocument
- _FPDF_LoadMemDocument
- _FPDF_CloseDocument
- _FPDF_GetPageCount
- _FPDF_LoadPage
- _FPDF_GetPageWidth
- _FPDF_GetPageHeight
- _FPDF_GetPageWidthF
- _FPDF_GetPageHeightF
- _FPDF_GetPageSizeByIndex
- _FPDF_ClosePage
- _FPDFPage_CountObjects
- _FPDFPage_GetObject
- _FPDFPage_GenerateContent
- _FPDFPageObj_Destroy
- _FPDFText_LoadPage
- _FPDFText_CountChars
- _FPDFText_GetCharBox
- _FPDFText_ClosePage
- _FPDFBitmap_Create
- _FPDFBitmap_CreateEx
- _FPDFBitmap_FillRect
- _FPDF_RenderPageBitmap
- _FPDFBitmap_Destroy
- _FPDF_DeviceToPage
- _FPDF_PageToDevice


## Author

- Jaewook Ahn

## License

This project is licensed under the [MIT License](./LICENSE).
