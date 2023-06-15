import styles from './news.module.css';
import { UsersProps } from '../users/users';
import { CommentsProps } from './comments/comments';
import { useEffect, useState, lazy, } from 'react';
import { getFullStaticPath } from '../../utils/static';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCookie } from '../../utils/cookies';

export interface NewsDtos {
  id: string,
  title: string,
  description: string,
  cover: string,
  author: string,
  //comments: CommentsProps[],
  createdAt: string,
  updatedAt: string
}

export interface NewsProps { }

export function News(props: NewsProps) {

  // const [isAddNews, setIsAddNews] = useState(false);

  const [styleBlockCreate, setStyleBlockCreate] = useState('none');



  async function sendForm() {
    const formData = new FormData(document.getElementById('formCreateNews') as HTMLFormElement);
    formData.append('userId', getCookie('idUser') || '1')
    mutation.mutate(formData);
  }

  async function postTodo(formData: FormData) {
    const responce = await fetch('http://localhost:3001/api/news/api', {
      method: 'POST',
      body: formData,
    })
    if (responce.ok) {
      window.alert('Новость успешно создана!');
      setStyleBlockCreate('none');
    }
  }

  const handleCreateNewsClick = () => {
    setTimeout(() => {
      if (styleBlockCreate === 'none') {
        setStyleBlockCreate('block');
      } else setStyleBlockCreate('none');
    }, 0);
  };

  const sortNews = (news: NewsDtos[]) => {
    return news.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
  }
  // Получаем доступ к клиенту
  const queryClient = useQueryClient();
  // Запрос
  const { isLoading, error, data } = useQuery<any, any, NewsDtos[]>('NewsToDos', () => {

    return fetch('http://localhost:3001/api/news/api/all', {
      method: 'GET',
    })
      .then(async (response) => {
        const newsList = await response.json()
        return newsList;
      })
      .then(newsList => {
        console.time('sorting');
        const sortedNews = sortNews(newsList);
        console.timeEnd('sorting');
        return sortedNews
      })
  })

  //Мутация
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Инвалидация и обновление
      queryClient.invalidateQueries('NewsToDos');
    },
  });


  if (isLoading) return <div>Loading...</div>

  if (error) return (<div>
    Error loading data
  </div>)

  if (!data || data.length === 0) {
    return <h1>Cписок пуст!</h1>
  } else {
    return (
      <div>
        <div>
          <div id='createNews' style={{ cursor: 'pointer' }} onClick={handleCreateNewsClick}>
            CREATE NEWS
          </div>
          <div className={styles['create']} style={{ display: `${styleBlockCreate}` }}>
            <img className={styles['create_close']}
              src="/assets/delete.png"
              alt="close form btn"
              onClick={() => setStyleBlockCreate('none')} />
            <h1>Создание новости</h1>
            <form className={styles['create_form']} id='formCreateNews'>
              <div className={styles['create_form_input']}>
                <label htmlFor="titleInput" className="form-label">Заголовок</label>
                <input type="text" className="form-control" name='title' id='titleInput' />
              </div>
              <div className={styles['create_form_input']}>
                <label htmlFor="descriptionInput" >Описание</label>
                <textarea name="description" id="descriptionInput" ></textarea>
              </div>
              <div className={styles['create_form_input']} >
                <label htmlFor="cover">Обложка новости</label>
                <input type="file" className="form-control-file" name="cover" id="cover" />
              </div>
              <button type="button" className={styles['create_form_button']} onClick={sendForm}>Создать</button>
            </form>
          </div>
        </div>
        <div className={styles["news_list"]} >
          {data.map((news: NewsDtos) => {
            const cover = news.cover
              ? getFullStaticPath(news.cover)
              : 'https://www.fda.gov/files/CDER-whatsnew.png';

            return (
              <div key={news.id}>
                <div className={styles['card']}
                // onClick={() => window.location.href = `/news/${news.id}/detail`}
                >
                  <div className={styles["card-body"]}>
                    <p className={styles["card-title"]}>{news.title}
                    </p>
                    <p className={styles["card-subtitle"]}>Автор:
                      {news.author}
                    </p>
                    <img src={cover}
                      className="card-img-top"
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        background: 'lightgray'
                      }} alt='cover news'>
                    </img>
                    <p className={styles["card-text"]}>
                      {news.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          }
          )}
        </div >
      </div>
    );
  }
}

export default News;
