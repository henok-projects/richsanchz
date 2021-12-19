import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styles from 'styled-jsx/css'
import { Brightness6Rounded } from "@material-ui/icons";
import Layout from './character/layout';
import { ThemeProvider } from "styled-components"
import { useLazyQuery } from '@apollo/client'
import { lightTheme, darkTheme, GlobalStyles } from "./character/ThemeConfig"
import useDarkMode from "use-dark-mode"
import {GET_EPSODES_QUERY} from '../graphql/Queries'

const defaultEndpoint = 'https://rickandmortyapi.com/api/character/';
export async function getServerSideProps(){
  const res= await fetch(defaultEndpoint);
  const data = await res.json();
  return {
  props: {
    data
  }
  }

}
function Home({data}) {
//theme
const [isMounted, setIsMounted] = useState(false)
  const darkmode = useDarkMode(true)
  const theme = darkmode.value ? darkTheme : lightTheme

  useEffect(() => {
    setIsMounted(true)
  }, [])



  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });

  //
  const [epsodeSearched, setEpsodeSearched] =useState("")
  const [getEpsode,{epsode,error}] = useLazyQuery(GET_EPSODES_QUERY,{
    variables:{name:epsodeSearched}
});
if(error) return <h3>error found</h3>;


  const { current } = page;

useEffect(() => {
  if ( current === defaultEndpoint ) return;

  async function request() {
    const res = await fetch(current)
    const nextData = await res.json();

    updatePage({
      current,
      ...nextData.info
    });

    if ( !nextData.info?.prev ) {
      updateResults(nextData.results);
      return;
    }

    updateResults(prev => {
      return [
        ...prev,
        ...nextData.results
      ]
    });
  }

  request();
}, [current]);

function handleLoadMore() {
  updatePage(prev => {
    return {
      ...prev,
      current: page?.next
    }
  });
}

function handleOnSubmitSearch(e) {
  e.preventDefault();

  const { currentTarget = {} } = e;
  const fields = Array.from(currentTarget?.elements);
  const fieldQuery = fields.find(field => field.name === 'query');

  const value = fieldQuery.value || '';
  const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

  updatePage({
    current: endpoint
  });
}
  return (
    
    <div className="container">
      <Head>       
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>    
          <span className="logo">
            <Image  src="/logo.svg" alt="Vercel Logo" width={72} height={16} />           
          </span>
       
      <div className="main">
     
      {/* <div className="wrapper">
      <SearchRounded color="inherit" />
      <input className="" />
    </div> */}
        

        <form className="search" onSubmit={handleOnSubmitSearch}>
          <input name="query" type="search" placeholder='Search Character' onChange={(event)=>{setEpsodeSearched(event.target.value)}}/>
          <button onClick={()=>getEpsode()}>Search</button>
        </form>      
        <br/>
          <ThemeProvider theme={theme}>
           <GlobalStyles className="swi" />
           <button className="swi" onClick={darkmode.toggle}>Switch Mode</button>           
         </ThemeProvider>
         
        <ul className="grid">
            {results.map(result => {
             const { id, name, image } = result;
              return (
                <li key={id} className="card"> 
                  <li>
                  <h3 className='name'>{ name }</h3>
                  </li> 
                  <li>
                    <a href="#">
                    <img className='IMG' src={image} alt={`${name} Thumbnail`} />
                    
                    </a>
                  </li>              
                   
                              
                </li>
              )
            })}
          </ul>
        <p>
          <button onClick={handleLoadMore}>Load more</button>
        </p>
      </div>
      </main>
      <style jsx>
        {`
        .container{
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
      }
      .main{
          padding: 0.5re 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;     
      
      }
             
      .themeSwitcher {
        border: none;
        background-color: transparent;
        padding: 0;

        color: var(--text-color-secondary);
        margin-left: 4px;

        display: flex;
        justify-content: center;
        align-items: center;
      }


        .grid{
          list-style: none;
          margin-left: 0;
          padding-left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1500px;
          margin-top: 3em;
           }
      .card{
          margin: 1rem;
          display:inline;
          max-width: 400px;
          flex-basis: 45%;         
          padding-left: 20px;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease;
          border-color: 00.15s ease;
          max-height:150px;
      
      }
      .IMG{
        max-width: 150px;
        max-height: 230px;
        max-height:90px;
        marig-left: 2px !important;
        margin-bottom:10px;
        padding-bottom:30px;

      }
      
      .logo{
          height: 1em;
          display: inline;
          margin-left: 30px !important;
          
          
      }
      @media(max-width:600px) {
       .grid{
           width: 100%;
           flex-direction: column;
       }
      
      }
      .search input {
        margin-right: .3em;
        width:300px;
        height: 28px;

      }
      
      @media (max-width: 600px) {
        .search input {
          margin-right: 0;
          margin-bottom: .5em;
        }
      
        .search input,
        .search button {
          width: 100%;
        }
      }
      .footer{
        width: 100%;
        height: 100px;
        border-top: 1px solid #eaeaea;
        display: flex;
        
      }
      
        
        `}
      </style>

    </div>
  )
}

export default Home;