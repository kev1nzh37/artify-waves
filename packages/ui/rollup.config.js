import typescript from "@rollup/plugin-typescript"

export default {
  input: "index.ts",
  output: {
    file: "dist/index.js",
  },
  external: ["react/jsx-runtime", "@repo/core", "react"],
  plugins: [typescript()],
}
