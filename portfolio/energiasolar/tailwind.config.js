/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        // Adicione outros arquivos HTML/JS/Vue/React que usam classes Tailwind aqui
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#0B1E3B',    /* Azul Marinho Institucional */
                    orange: '#F58220',  /* Laranja do Logo */
                    light: '#F3F4F6',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        }
    },
    plugins: [],
}