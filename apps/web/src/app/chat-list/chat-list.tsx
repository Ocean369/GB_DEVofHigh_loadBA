import styles from './chat-list.module.scss';

/* eslint-disable-next-line */
export interface ChatListProps {}

export function ChatList(props: ChatListProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ChatList!</h1>
    </div>
  );
}

export default ChatList;
