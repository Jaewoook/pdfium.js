// @ts-check
import copy from "rollup-plugin-copy";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import packageJson from "./package.json" assert { type: "json" };

const wasmPath = "src/libs/pdfium.wasm";
const entryFile = "src/index.ts";
const distDir = "dist";

/** @type {import("rollup").RollupOptions[]} */
const config = [
  {
    input: entryFile,
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        exports: "named",
      },
      {
        file: packageJson.exports["."].import,
        format: "es",
      },
    ],
    plugins: [esbuild(), copy({ targets: [{ src: wasmPath, dest: distDir }] })],
  },
  {
    input: entryFile,
    output: {
      file: packageJson.types,
    },
    plugins: [dts()],
  },
];

export default config;
