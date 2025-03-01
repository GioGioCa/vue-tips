module.exports = {
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'orange-light': '#FFE8D6',
                'black': '#000000',
                'off-white': '#F8F9FA',
                'blue-500': '#3b82f6',
                'gray-500': '#6b7280',
                customPink: "#f7c1bd",
            },
            fontFamily: {
                times: ['"Times New Roman"', 'serif'],
            },
        },
    },
    plugins: [],
};
