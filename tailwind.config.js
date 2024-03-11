/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '2rem'
		},
		extend: {
			colors: {
				primary: '#2E64FD',
				secondary: '#F3528B',
				disabledButton: '#4D4D4D'
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
