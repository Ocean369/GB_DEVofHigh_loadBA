// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignIn from './sign-in/sign-in';
import Profile from './profile/profile';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import Home from './home/home';
import Chat from './chat/chat';
import ChatMessage from './chat-message/chat-message';

const News = lazy(() => import('./news/news'));

const queryClient = new QueryClient();

export function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <header className={styles['head']}>
          <nav className={styles['navigator']}>
            <div>
              <div id="allNews" style={{ cursor: 'pointer' }}>
                <Link to="/news/all" className={styles['linkNav']}>ALL NEWS</Link>
              </div>
            </div>
            <div>
              <div id="chat" style={{ cursor: 'pointer' }}>
              <Link to="/chat" className={styles['linkNav']}>CHAT</Link>
              </div>
            </div>
            <div className={styles['authorization']}>
              <div id="Profile" style={{ cursor: 'pointer' }}>
                <Link to="/user/profile" className={styles['linkNav']}>PROFILE</Link>
              </div>
              <div id="authorization" style={{ cursor: 'pointer' }}>
                <Link to="/signin" className={styles['linkNav']}>SIGN IN</Link>
              </div>
            </div>
          </nav>
        </header>

        <br />
        <hr />
        <br />

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/news/all" element={<News />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path='/' element={<Home />}></Route>
            <Route path='/chat' element={<Chat/>}></Route>
          </Routes>
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
