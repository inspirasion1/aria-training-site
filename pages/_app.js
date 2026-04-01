import "../styles/globals.css"
import Head from "next/head"
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>YMMH - Train ARIA</title>
        <meta name="description" content="Help train an intelligence from the ground up. Young's Multimedia Holdings community training initiative." />
      </Head>
      <Component {...pageProps} />
    </>
  )
}