import mdx from "@mdx-js/rollup";

export default {
  root: ".",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  plugins: [mdx()],
};
