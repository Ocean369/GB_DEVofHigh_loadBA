import styles from './home.module.scss';

/* eslint-disable-next-line */
export interface HomeProps { }

export function Home(props: HomeProps) {
  return (
    <div className={styles['container']}>
      <h1>Здесь вы найдете самые свежие новости!</h1>
      <img src="/assets/news-2.png" alt="" />

    </div>
  );
}

export default Home;
