/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Jalur ini harus benar
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a192f",    // Biru sangat gelap ala Trafoindo
          primary: "#1d4ed8", // Biru inti
        }
      },
    },
  },
  plugins: [],
};
export default config;