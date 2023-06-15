import styles from './users.module.scss';
//import { Role } from '../../../../api/src/app/auth/role/role.enum';
import { NewsProps } from '../news/news';
import { CommentsProps } from '../news/comments/comments';

/* eslint-disable-next-line */
export interface UsersProps {

  id: number;

  firstName: string;

  avatar: string;

  email: string;

  password: string;

  //roles: Role;

  news: NewsProps[];

  comments: CommentsProps[];

  createdAt: Date;

  updatedAt: Date;
}

export function Users(props: UsersProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Users!</h1>
    </div>
  );
}

export default Users;
