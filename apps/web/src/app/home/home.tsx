import { useEffect, useState } from 'react';
import styles from './home.module.scss';
//import {News} from '../../../../api/src/app/news/schemas/news.schemas'

/* eslint-disable-next-line */
export interface HomeProps { }

export function Home(props: HomeProps) {

  const [topAuthor, setTopAuthor] = useState([]);

  async function getTopAuthor() {
    const responce = await fetch('http://localhost:3001/api/news/range', {
      method: 'GET',
    })
    if (responce.ok) {
      responce.json().then((top)=>{
        setTopAuthor(top);
        console.log(top);
      });
    }
  }

  useEffect(()=> {
    getTopAuthor();
  },[]);

  return (
    <div className={styles['container']}>
      <h1>Здесь вы найдете самые свежие новости!</h1>
      <img src="/assets/news-2.png" alt="" />
      <div className={styles['topTen']}>
        <h5>Топ-10 авторов по количеству публикаций</h5>
        {topAuthor.map((val:string,ind:number)=> {
          //if(ind ===0 || (ind % 2) === 0)
          return (
            <>
              {(ind ===0 || (ind % 2) === 0) ?
                <span className={styles['topTen_author']}>{val}</span>
              : <span>  - {val} news </span>
              }
              {(ind !== 0 && (ind % 2)!== 0)
                ? <hr></hr>
                : ''}
            </>
          )
        })}
      </div>
    </div>
  );
}

export default Home;
