import '../styles/globals.css'
import Script from 'next/script'

function MyApp({Component, pageProps}) {
    return <>
        {/* <Script src="https://unpkg.com/react@17.0.2/umd/react.development.js"/>
        <Script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"/>
        <Script src="https://unpkg.com/@zsviczian/excalidraw@0.13.0-obsidian/dist/excalidraw.development.js"/> */}
        <Component {...pageProps} />
    </>
}

export default MyApp
