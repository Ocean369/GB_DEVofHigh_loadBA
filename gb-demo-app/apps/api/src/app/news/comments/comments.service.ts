import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { NewsService } from '../news.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { UsersService } from '../../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export type Reply = {
  id?: number;
  message: string;
  author: string;
}

@Injectable()
export class CommentsService {
  private readonly comments = {}

  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    private userService: UsersService,
    @Inject(forwardRef(() => NewsService))
    private newsService: NewsService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(idNews: number, message: string, userId: number): Promise<CommentsEntity | Error> {

    try {
      const commentsEntity = new CommentsEntity;
      commentsEntity.message = message;
      const _user = await this.userService.findById(userId);
      commentsEntity.user = _user;
      const _news = await this.newsService.findById(idNews);
      commentsEntity.news = _news;
      return await this.commentsRepository.save(commentsEntity);
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }
  }

  async findById(id: number): Promise<CommentsEntity | null> {
    try {
      return await this.commentsRepository.findOneBy({ id })

    } catch (error) {
      throw new Error(`Произошла ошибка: ${error}`)
    }
  }

  async findAll(newsId: number): Promise<CommentsEntity[] | null | Error> {
    try {
      return await this.commentsRepository.find({
        relations: ["news", "user"],
        where: { news: { id: newsId } },
      });
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }
  }

  async remove(id: number): Promise<Boolean | Error> {
    try {
      const _removingComment = await this.commentsRepository.findOne({
        where: { id: id },
        relations: ['news']
      });
      if (_removingComment && _removingComment instanceof CommentsEntity) {
        // this.eventEmitter.emit('comment.remove', {
        //     commentId: id,
        //     newsId: _removingComment.news.id
        // })
        await this.commentsRepository.delete(id);
        return true
      }
      return false
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }
  }

  async removeAllForIdNews(comments: CommentsEntity[]): Promise<Boolean | Error> {
    try {
      await this.commentsRepository.remove(comments);
      return true
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }

  }

  async update(id: number, message: string): Promise<boolean | Error> {
    try {
      let _comment = await this.findById(id);
      if (_comment && _comment instanceof CommentsEntity) {
        const commentsEntity = new CommentsEntity;
        commentsEntity.message = message || commentsEntity.message;
        this.eventEmitter.emit('comment.edit', {
          commentId: id,
          newsId: _comment.news.id,
          message: commentsEntity.message
        })
        await this.commentsRepository.update(id, commentsEntity)
        return true
      }
      return false

    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`)
    }
  }
}

