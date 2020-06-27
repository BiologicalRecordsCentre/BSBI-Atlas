import node from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

export default {
  input: "index.js",
  output: {
    file: "dist/bigr.js",
    name: "bigr",
    format: "umd",
  },
  plugins: [node(), terser()]
}