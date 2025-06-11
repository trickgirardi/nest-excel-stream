import { Controller, Get, Res } from '@nestjs/common';
import { UsersService } from './user/user.service';
import { PostsService } from './post/post.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostsService,
  ) {}

  @Get('excel')
  async downloadExcel(@Res() res: Response) {
    await this.postService.streamPostsToExcel(res);
  }
}
