import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostModule {}
