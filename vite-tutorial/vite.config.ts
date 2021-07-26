import { resolve } from "path";
import { defineConfig } from "vite";
import { babel } from '@rollup/plugin-babel';
import vue from "@vitejs/plugin-vue";
import copy from 'rollup-plugin-copy'


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        rollupOptions: {
            input: ["src/background.ts", "src/focus.ts"],
            output: {
                entryFileNames: "[name].js",
                format: "esm"
            },
            plugins: [babel({ babelHelpers: 'bundled' })],
        },

        
        
        
    },
    plugins: [
        vue(),
        copy({
            targets: [
                {src: ['src/assets', 'src/manifest.json'], dest:'./dist'},
            ]
        }),
    ],
})
