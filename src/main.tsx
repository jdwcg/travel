import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import GlobalStyle from './styles/GlobalStyle';

import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import ScrollToTop from './components/ScrollToTop.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <ScrollToTop />
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
);
