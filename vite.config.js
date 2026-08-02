import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" uses relative asset paths so this builds correctly whether it's
// served from a custom domain, a GitHub Pages user site, or a project site
// (https://<user>.github.io/<repo>/) without needing to hardcode the repo name.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
