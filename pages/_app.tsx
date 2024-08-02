import { useState } from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const [apiInfo, setApiInfo] = useState(null);
  return (
      <Component {...pageProps} />
  )
    
}
