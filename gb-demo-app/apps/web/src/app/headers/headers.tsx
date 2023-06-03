import styles from './headers.module.scss';

/* eslint-disable-next-line */
export interface HeadersProps {}

export function Headers(props: HeadersProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Headers!</h1>
    </div>
  );
}

export default Headers;
