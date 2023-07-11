// @ts-check
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";
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
