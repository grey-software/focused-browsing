import { resolve } from "path";
import { defineConfig } from "vite";
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
            input: "src/background.ts",
            output: {
                entryFileNames: "[name].js",
            }
        },
        
    },
    plugins: [
        vue(),
        copy({
            targets: [
                {src: ['src/assets', 'src/manifest.json', 'src/background.html'], dest:'./dist'},
            ]
        }),
    ],
})
