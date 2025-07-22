export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        text: string;
        background: string;
    };
    fontSizes: {
        small: string;
        medium: string;
        large: string;
    };
    spacings: {
        xs: string;
        sm: string;
        md: string;
    };
}

export const theme: Theme = {
    colors: {
        primary: '#6C63FF',
        secondary: '#00BFFF',
        text: '#333333',
        background: '#FFFFFF',
    },
    fontSizes: {
        small: '14px',
        medium: '16px',
        large: '20px',
    },
    spacings: {
        xs: '8px',
        sm: '16px',
        md: '24px',
    },
};
