/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sq: {
          primary: '#7CA1D9',         // Primary Blue
          'primary-hover': '#6B90CB',   // Primary Blue Hover
          lilac: '#BEC3EA',           // Light Lilac
          lavender: '#D7C8E9',        // Lavender
          'soft-purple': '#DFC3E3',     // Soft Purple-Lilac
          pink: '#E7B5D3',            // Pastel Pink
          'pink-hover': '#DAA4C4',    // Pastel Pink Hover
          'pink-var': '#E7B6D4',      // Pastel Pink Variant
          
          // Theme defaults
          'light-bg': '#F4F5FB',
          'light-card': '#FFFFFF',
          'light-border': '#DFC3E3',
          'light-text': '#1E293B',
          'light-muted': '#5B507A',

          'dark-bg': '#0F111A',
          'dark-card': '#181B29',
          'dark-border': '#2D3148',
          'dark-text': '#F8FAFC',
          'dark-muted': '#D7C8E9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'panel': '0 4px 16px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}

