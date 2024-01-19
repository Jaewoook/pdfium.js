# PDFium.js Changelog

## v0.2.0 (2024-01-19)

- Upgrade pdfium WebAssembly binary version to 6183
- Embed wasm binary in loader file
- Fix library to work in Next.js (client component required)
- Remove `wasmPath` parameter from library options
- Update FPDF property `asm` to `wasmExports` ([check emscripten changelog](https://github.com/emscripten-core/emscripten/blob/main/ChangeLog.md#3144---072523))
- Update rollup build configuration
- Remove unused dependency

## v0.1.0 (2023-07-13)

- Initial version of PDFium.js
