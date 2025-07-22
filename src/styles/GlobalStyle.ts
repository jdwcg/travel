import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { Pretendard } from './font';

const GlobalStyle = createGlobalStyle`
    ${Pretendard}

    ${reset}


    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: 'Pretendard', sans-serif;
        font-size: 16px;
        color: #333;
        box-sizing: border-box;
    }

    *, *::before, *::after {
        box-sizing: inherit;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    ol, ul {
        list-style: none;
    }

    button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }


    h1, h2, h3, h4, h5, h6 {
        font-family: 'Pretendard', sans-serif;
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 0.5em;
    }
    p {
        margin-top: 0;
        margin-bottom: 1em;
    }
    `;

export default GlobalStyle;
