/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        // Deep space backgrounds
        'deep-space': '#0a0a0f',
        'cosmic-dark': '#0f0f1a',
        'nebula': '#1a1a2e',
        'stardust': '#16213e',
        
        // Aurora gradient colors - Cyan/Teal focused (no purple)
        'aurora': {
          purple: '#06b6d4', // Mapped to cyan for compatibility
          pink: '#14b8a6',   // Teal
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          teal: '#14b8a6',
        },
        
        // Accent colors - Cyan/Teal
        'accent': {
          DEFAULT: '#06b6d4',
          bright: '#22d3ee',
          dim: '#0891b2',
        },
        
        // Glass effect colors
        'glass': {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(6, 182, 212, 0.3)', // Cyan glow
        'glow-pink': '0 0 40px rgba(20, 184, 166, 0.3)',  // Teal glow
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'card': '0 20px 50px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #06b6d4, #14b8a6, #3b82f6)',
        'gradient-dark': 'linear-gradient(180deg, rgba(15, 15, 26, 0.9), rgba(10, 10, 15, 0.95))',
        'gradient-glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.5)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      screens: {
        'xs': '480px',
        'sm': '768px',
        'md': '1060px',
        'lg': '1280px',
        'xl': '1440px',
      },
    },
  },
  plugins: [],
}
