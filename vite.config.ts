import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.join(__dirname, "./src"),
        },
    },
    server: {
      host: "0.0.0.0",
      port: 8333, // port
      open: true,
      cors: true,
      proxy: {
        "/api": {
          // target: 'http://207.244.254.27:5020',
          target: "https://www.spacex.date/",
          // target: "https://bsc.spacex.date",
          changeOrigin: true,
          secure: false,
        },
        "/subapi": {
          target: "https://www.spacex.date/",
          // target: "https://bsc.spacex.date",
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/goldBrick/, '/api2/goldBrick/')
        },
      },
    },
    
});
