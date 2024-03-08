import typescript from "@rollup/plugin-typescript"

export default {
  input: "./index.ts",
  output: {
    file: "./dist/index.js",
    format: "esm",
  },
  plugins: [typescript()],
}
