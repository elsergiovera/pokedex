import Head from 'next/head'
import Image from 'next/image'
import Pokedex from './pokedex.js'

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
