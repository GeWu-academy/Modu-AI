import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "moduAi",
      filename: "remoteEntry.js",
      exposes: {
        "./ModuAiRemote": "./src/ModuAiRemote.tsx",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
  build: { target: "esnext" },
  server: { port: 5001, cors: true, origin: "http://localhost:5001" },
  preview: { port: 5001, cors: true },
});
