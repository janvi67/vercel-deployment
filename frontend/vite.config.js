import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // Ensures build output goes to dist
  },
  daisyui: {
   themes: ["light", "dark", "cupcake", "bumblebee", "retro"],
  },
  server: {
    allowedHosts: [
      'bb4f-2409-40c1-3016-3ae6-519d-ff79-5839-b66f.ngrok-free.app'
    ]
  }
});
