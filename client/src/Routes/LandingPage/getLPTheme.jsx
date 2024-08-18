import { alpha } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const brand = {
    50: '#f7f5ed',
    100: '#f0ebdb',
    200: '#e1d6b7',
    300: '#d2c293',
    400: '#c3ae6f',
    500: '#b49a4b',
    600: '#907b3c',
    700: '#6c5c2d',
    800: '#483d1e',
    900: '#241f0f',
};

export const secondary = {
    50: '#f8f5ed',
    100: '#f1ecda',
    200: '#e3d8b5',
    300: '#d5c590',
    400: '#c7b16b',
    500: '#b99e46',
    600: '#947e38',
    700: '#6f5f2a',
    800: '#4a3f1c',
    900: '#25200e',
};

export const gray = {
    50: '#f8f5ec',
    100: '#f2ecd9',
    200: '#e5d8b3',
    300: '#d8c58d',
    400: '#cbb267',
    500: '#be9f41',
    600: '#987f34',
    700: '#725f27',
    800: '#4c3f1a',
    900: '#26200d',
};

export const green = {
    50: '#F6FEF6',
    100: '#E3FBE3',
    200: '#C7F7C7',
    300: '#A1E8A1',
    400: '#51BC51',
    500: '#1F7A1F',
    600: '#136C13',
    700: '#0A470A',
    800: '#042F04',
    900: '#021D02',
};

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: brand[500],
            contrastText: brand[50],
        },
        secondary: {
            light: secondary[300],
            main: secondary[500],
        },
        warning: {
            main: '#F7B538',
        },
        error: {
            light: red[50],
            main: red[500],
        },
        success: {
            light: green[300],
            main: green[400],
        },
        grey: {
            50: gray[50],
            100: gray[100],
            200: gray[200],
            300: gray[300],
            400: gray[400],
            500: gray[500],
            600: gray[600],
            700: gray[700],
            800: gray[800],
            900: gray[900],
        },
        divider: alpha(gray[300], 0.5),
        background: {
            default: '#fdfaf1',
            paper: gray[50],
        },
        text: {
            primary: gray[800],
            secondary: gray[600],
        },
        action: {
            selected: `${alpha(brand[200], 0.2)}`,
        },
    },
    typography: {
        fontFamily: ['"Inter", "sans-serif"'].join(','),
        h1: {
            fontSize: 60,
            fontWeight: 600,
            lineHeight: 78 / 70,
            letterSpacing: -0.2,
        },
        h2: {
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: 42,
            lineHeight: 1.2,
        },
        h4: {
            fontSize: 36,
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h5: {
            fontSize: 20,
            fontWeight: 600,
        },
        h6: {
            fontSize: 18,
        },
        subtitle1: {
            fontSize: 18,
        },
        subtitle2: {
            fontSize: 16,
        },
        body1: {
            fontWeight: 400,
            fontSize: 15,
        },
        body2: {
            fontWeight: 400,
            fontSize: 14,
        },
        caption: {
            fontWeight: 400,
            fontSize: 12,
        },
    },
});

export default function getLPTheme(mode) {
    return {
        ...getDesignTokens(mode),
        components: {
            MuiToggleButtonGroup: {
                styleOverrides: {
                    root: () => ({
                        borderRadius: '10px',
                        boxShadow: `0 4px 16px ${alpha(gray[400], 0.2)}`,
                        '& .Mui-selected': {
                            color: brand[500],
                        },
                    }),
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: () => ({
                        padding: '12px 16px',
                        textTransform: 'none',
                        borderRadius: '10px',
                        fontWeight: 500,
                    }),
                },
            },
            MuiButtonBase: {
                defaultProps: {
                    disableTouchRipple: true,
                    disableRipple: true,
                },
                styleOverrides: {
                    root: {
                        boxSizing: 'border-box',
                        transition: 'all 100ms ease-in',
                        '&:focus-visible': {
                            outline: `3px solid ${alpha(brand[500], 0.5)}`,
                            outlineOffset: '2px',
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        boxSizing: 'border-box',
                        boxShadow: 'none',
                        borderRadius: '10px',
                        textTransform: 'none',
                        '&:active': {
                            transform: 'scale(0.98)',
                        },
                        ...(ownerState.size === 'small' && {
                            maxHeight: '32px',
                        }),
                        ...(ownerState.size === 'medium' && {
                            height: '40px',
                        }),
                        ...(ownerState.variant === 'contained' &&
                            ownerState.color === 'primary' && {
                            color: brand[50],
                            background: '#b59c4f',
                            boxShadow: `inset 0 1px ${alpha(brand[300], 0.4)}`,
                            '&:hover': {
                                background: '#b59c4f',
                                backgroundImage: 'none',
                                boxShadow: `0 0 0 1px  ${alpha(brand[300], 0.5)}`,
                            },
                        }),
                        ...(ownerState.variant === 'outlined' && {
                            backgroundColor: alpha(brand[300], 0.1),
                            borderColor: brand[300],
                            color: brand[500],
                            '&:hover': {
                                backgroundColor: alpha(brand[300], 0.3),
                                borderColor: brand[200],
                            },
                        }),
                        ...(ownerState.variant === 'text' && {
                            color: brand[500],
                            '&:hover': {
                                backgroundColor: alpha('#ceb76f', 0.3),
                                borderColor: brand[200],
                            },
                        }),
                    }),
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: () => ({
                        borderColor: `${alpha(gray[200], 0.8)}`,
                    }),
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '& label .Mui-focused': {
                            color: 'white',
                        },
                        '& .MuiInputBase-input': {
                            boxSizing: 'border-box',
                            '&::placeholder': {
                                opacity: 0.7,
                            },
                        },
                        '& .MuiOutlinedInput-root': {
                            boxSizing: 'border-box',
                            minWidth: 280,
                            minHeight: 40,
                            height: '100%',
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: gray[200],
                            transition: 'border-color 120ms ease-in',
                            '& fieldset': {
                                border: 'none',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                background: `${alpha('#FFF', 0.3)}`,
                            },
                            '&:hover': {
                                borderColor: brand[300],
                            },
                            '&.Mui-focused': {
                                borderColor: brand[400],
                                outline: '4px solid',
                                outlineColor: brand[200],
                            },
                        },
                    }),
                },
            },
        },
    };
}