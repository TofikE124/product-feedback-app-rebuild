import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: {
        max: "48rem",
      },
      md: {
        min: "48rem",
        max: "60rem",
      },
      mdsm: {
        max: "60rem",
      },
      lgmd: { min: "48rem" },
      lg: {
        min: "60rem",
      },
    },
    extend: {
      colors: {
        "electric-violet": "#AD1FEA",
        "dark-sky-blue": "#4661E6",
        "navy-blue": "#3A4374",
        "steel-blue": "#647196",
        "soft-white": "#F2F4FF",
        "cloud-white": "#F7F8FD",
        "salmon-pink": "#F49F85",
        "turquoise-blue": "#62BCFA",
        white: "#FFFFFF",
        crimson: "#D73737",
      },
    },
  },
  plugins: [],
};
export default config;
