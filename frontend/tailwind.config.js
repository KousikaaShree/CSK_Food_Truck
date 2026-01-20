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
          bg: "#FFF8EE",
          cream: "#FAF7F2",
          // Navbar / rich warm brown
          brown: "#5A3E2B",
          brownSoft: "#6B4A32",
          creamText: "#FFF8EE",
          charcoal: "#222222",
          text: "#444444",
          yellow: "#F6C453",
          yellowSoft: "#FFD369",
          gold: "#E6B566",
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

