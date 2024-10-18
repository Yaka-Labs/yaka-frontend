module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#b8b6cb',
        body: '#090333',
        darkGray: '#44476A',
        pink: '#ED00C9',
        purple: '#BD00ED',
        left: '#1D023B',
        right: '#17023E',
        green: '#26fffe',
        blue: '#0000AF',
        success: '#51B961',
        error: '#cf3a41',
        warn: '#edb831',
        info: '#006cff',
        placeholder: '#757384',
        lightGray: '#DEDBF2',
        cardBg: '#101645',
        cardDark: '#0E1236',
        cardLight: '#1A265E',
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
      },
      screens: {
        sm: '600px',
        mdLg: '960px',
        '3xl': '1920px',
      },
      boxShadow: {
        box: '0 0 45px #4E0042',
      },
    },
  },
  plugins: [],
}
