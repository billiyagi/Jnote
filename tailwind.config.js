/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './dist/**/*.{html,js}'],
	theme: {
		fontFamily: {
		sans: ['Nunito', 'sans-serif'],
		serif: ['Merriweather', 'serif'],
		},
	},
	plugins: [require('daisyui')],
// daisyUI config (optional)
	daisyui: {
		styled: true,
		themes: true,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: "",
		darkTheme: "dark",
	},
}