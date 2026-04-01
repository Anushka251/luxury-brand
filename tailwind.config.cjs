/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#38040E",
        pink:"#D87F81",
        peach: "#EAB595",
        bronze: "#B08D57",
        ivory: "#F8F6F2",
        gold: "#C6A45E",
        charcoal: "#111111",
        muted: "#7A7A7A",
      },

      /* 🔥 ADD THIS PART */
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
