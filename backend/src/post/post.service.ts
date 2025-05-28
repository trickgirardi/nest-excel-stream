import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Post, Prisma } from 'generated/prisma';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { data, where } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }

  async streamPostsToExcel(res: Response) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="posts.xlsx"');

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet('Posts');

    worksheet.addRow(['ID', 'Título', 'Conteúdo', 'Publicado', 'AutorId']);

    const BATCH_SIZE = 150;
    let lastId = 0;

    while (true) {
      const posts = await this.prisma.post.findMany({
        where: { id: { gt: lastId } },
        take: BATCH_SIZE,
        orderBy: { id: 'asc' },
      });

      if (posts.length === 0) break;

      posts.forEach((post) => {
        worksheet.addRow([
          post.id,
          post.title,
          post.content,
          post.published,
          post.authorId,
        ]);
      });

      lastId = posts[posts.length - 1].id;
    }

    await workbook.commit();
  }
}
