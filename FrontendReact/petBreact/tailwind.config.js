/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-accent)',
          secondary: 'var(--color-accent-hover)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
        },
        backgroundColor: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        textColor: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        borderColor: {
          DEFAULT: 'var(--color-border)',
        },
        boxShadow: {
          card: '0 2px 8px var(--color-card-shadow)',
          dropdown: '0 4px 12px var(--color-card-shadow)',
          modal: '0 10px 25px var(--color-card-shadow)',
        },
        transitionProperty: {
          'smooth': 'background-color, color, border-color, box-shadow, transform',
        },
        transitionDuration: {
          DEFAULT: '300ms',
        },
        transitionTimingFunction: {
          DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        animation: {
          'bounce-slow': 'bounce-slow 3s infinite',
          'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fadeIn': 'fadeIn 1s ease-in',
          'slideIn': 'slideIn 1s ease-out',
          'float': 'float 6s ease-in-out infinite',
          'spin-slow': 'spin 6s linear infinite',
        },
        keyframes: {
          'bounce-slow': {
            '0%, 100%': {
              transform: 'translateY(-10%)',
              animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
            },
            '50%': {
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
            }
          },
          'pulse-slow': {
            '0%, 100%': {
              opacity: '1'
            },
            '50%': {
              opacity: '0.7'
            }
          },
          'fadeIn': {
            '0%': {
              opacity: '0'
            },
            '100%': {
              opacity: '1'
            }
          },
          'slideIn': {
            '0%': {
              transform: 'translateY(20px)',
              opacity: '0'
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: '1'
            }
          },
          'float': {
            '0%, 100%': {
              transform: 'translateY(0)'
            },
            '50%': {
              transform: 'translateY(-20px)'
            }
          }
        },
      },
    },
    plugins: [],
  };
  