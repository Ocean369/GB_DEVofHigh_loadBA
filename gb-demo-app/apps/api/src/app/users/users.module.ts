
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService,
    TypeOrmModule.forFeature([UsersEntity])],
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule { }
