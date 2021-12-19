import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';

const defaultEndPoint = 'https://rickandmortyapi.com/api/character/';
export async function getServerSideProps(){
  const res= await fetch(defaultEndPoint);
  const data = await res.json();
  return {
  props: {
    data
  }
  }

}
export default function Home({data}) {
  const {info, results:defaultResults =[]}= data;
  const [results,updateResults]= useState(defaultResults)
  const [page,updatePage]= useState({
    ...info,
    current: defaultEndPoint
  });

  const {current} =page;

  useEffect(()=>{
    if(current == defaultEndPoint)
    return 
    async function request(){
      const res = await fetch(current);
      const NextData = await res.json()
    }

    updatePage({
      current,
      ...NextData.info
    });

    if(!NextData.info?.pre){
      updateResults.NextData.results;
      return;
    }
    updateResults(pre=>{
      [...pre,
      ...NextData.results]
    })

  },request(),[current]);

  function handleLoadMore(){
    updatePage(pre=>{
      return{
      ...pre,
      current: page?.next
      }
    })
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Rick sanchz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        hello
        </h1>

        <p className={styles.description}>
         Rick and mortry wiki
        </p>
        <form className='search'>
          <inpu name="query" type ="search"/>
          <button>Search</button>
        </form>

        <ul className= "grid">
          {results.map(result=>{
            const {id, name,image} =result;

            return (
              <li key={id} className='card'>
                <a href="https://nextjs.org/docs" className={styles.card}>
                  <h2>{name}</h2>
                  <image src={image} alt={'$name'} />
                </a>
          </li>     
            )
          })}
                       
        </ul>
        <p>
          <button onClick={handleLoadMore}>Load more</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}