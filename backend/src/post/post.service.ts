import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { getPosts } from '@prisma/client/sql';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

interface IPostWithAuthor {
  'ID do post': number;
  Título: string;
  Conteúdo: string | null;
  'Publicado?': boolean | null;
  'ID do autor': number;
  'E-mail do autor': string;
  'Nome do autor': string | null;
}

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

    const BATCH_SIZE = 150;
    let lastId = 0;
    let isFirstBatch = true;
    let headers: string[] = [];

    while (true) {
      const posts: IPostWithAuthor[] = await this.prisma.$queryRawTyped(
        getPosts(lastId, BATCH_SIZE),
      );

      if (posts.length === 0) break;

      if (isFirstBatch && posts.length > 0) {
        headers = Object.keys(posts[0]);
        worksheet.addRow(headers).commit();
        isFirstBatch = false;
      }

      posts.forEach((post) => {
        const row = headers.map(
          (header) => post[header as keyof IPostWithAuthor],
        );
        worksheet.addRow(row).commit();
      });

      lastId = lastId + BATCH_SIZE;
    }

    await workbook.commit();
  }
}
