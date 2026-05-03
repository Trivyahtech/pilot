import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Open Sans', 'sans-serif'],
				'heading': ['Poppins', 'sans-serif'],
			},
			colors: {
				border: '#737476',
				input: '#FFFFFF',
				ring: '#1E398A',
				background: '#FFFFFF',
				foreground: '#1E1E1E',
				primary: {
					DEFAULT: '#314993',
					foreground: '#FFFFFF',
					light: '#5B6FBA',
					dark: '#1E398A'
				},
				secondary: {
					DEFAULT: '#737476',
					foreground: '#FFFFFF',
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#E0E0E0',
					foreground: '#5A5E66',
				},
				accent: {
					DEFAULT: '#1E398A',
					foreground: '#FFFFFF',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E1E1E',
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E1E1E',
				},
				sidebar: {
					DEFAULT: '#FFFFFF',
					foreground: '#1E1E1E',
					primary: '#314993',
					'primary-foreground': '#FFFFFF',
					accent: '#1E398A',
					'accent-foreground': '#FFFFFF',
					border: '#E5E5E5',
					ring: '#1E398A'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'marquee': 'marquee 20s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
