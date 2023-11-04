import Head from 'next/head'
import Pokedex from '../components/pokedex.js'

// TEST!!!

export default function Home() {
  return (
    <>
      <Head>
        <title>Pokedex</title>
        <meta name="description" content="Deva's Pokedex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pokedex />
    </>
  )
}
