/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        'bc-bg': '#fef4e5',
        'bc-text': '#1f2937',
        'bc-accent': '#a97eff',
        'bc-accent2': '#c084fc',
        'bc-primary': '#7851C7',
        'bc-primary-purple': '#8B7EC8',
        'bc-soft-purple': '#E8E1F5',
        'bc-neutral-white': '#FFFFFF',
        'bc-neutral-gray': '#F5F5F7',
        'bc-text-light': '#8E8E93',
        'bc-g-primary': '#0EA5E9',
        'bc-g-primary-dark': '#0284C7',
        'bc-g-bg': '#F8FAFC',
        'bc-g-text': '#334155',
        'bc-g-text-light': '#94A3B8',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'bc-radius': '16px',
      },
      boxShadow: {
        'bc-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        'bc-shadow-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}