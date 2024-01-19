// @ts-check
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import packageJson from "./package.json" assert { type: "json" };

const entryFile = "src/index.ts";

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
    plugins: [esbuild()],
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
