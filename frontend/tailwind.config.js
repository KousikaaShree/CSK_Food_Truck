/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        csk: {
          // Dark, premium palette with yellow accent
          bg: "#0B0B0E",
          cream: "#14151A",
          brown: "#121013",      // used for navbar backgrounds
          brownSoft: "#1C1B20",
          creamText: "#F4F4F5",
          charcoal: "#EAEAEA",
          text: "#C7C7CC",
          yellow: "#F5C400",
          yellowSoft: "#FFD95A",
          gold: "#F9D27C",
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "Poppins", "serif"],
        body: ["Inter", "Open Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(34, 34, 34, 0.10)",
        lift: "0 18px 45px rgba(34, 34, 34, 0.14)",
      },
    },
  },
  plugins: [],
}

