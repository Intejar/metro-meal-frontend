/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  corePlugins: {
    preflight: true, // Keep it as true for resetting styles if necessary
  },
  theme: {
    extend: {
      // colors: {
      //   green: {
      //     600: "#16a34a", // Explicitly define any green color you’re using
      //   },
      //   slate: {
      //     900: "#0f172a", // Explicitly define slate color to avoid parsing issues
      //   },
      //   white: "#ffffff", // Ensuring white is interpreted as expected
      //   gray: {
      //     800: "#1f2937",
      //   },
      // },
    },
  },
  plugins: [require("daisyui")],
};
