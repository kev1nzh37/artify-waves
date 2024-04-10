import typescript from "@rollup/plugin-typescript"
import postcss from 'rollup-plugin-postcss'

export default {
  input: "index.ts",
  output: {
    file: "dist/index.js",
  },
  external: ["react/jsx-runtime", "@repo/core", "react"],
  plugins: [
    typescript(),
    postcss({
      extensions: ['.css', '.scss'],
      extract: false, // 将样式注入到 JS 中，或者设置为 true 来提取到单独的文件
    }),
  ],
}
