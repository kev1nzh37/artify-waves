import typescript from "@rollup/plugin-typescript"
import { string } from "rollup-plugin-string"
export default {
  input: "./index.ts",
  output: {
    file: "./dist/index.js",
    format: "es",
  },
  external: ['ogl'],
  plugins: [
    typescript(),
    string({
      include: "**/*.glsl",
    }),
  ],
}
