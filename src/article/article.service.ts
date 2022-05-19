import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository, UpdateResult } from 'typeorm';
import { ArticleCreate, ArticleUpdate } from './article.dto';
import { Article } from './article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return await this.articleRepo.find();
  }

  async findAllArticleId(): Promise<Article[]> {
    return await this.articleRepo.find({
      select: ['id'],
    });
  }

  async findArticleVoucher(id: number): Promise<Article> {
    return await getRepository(Article)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.vouchers', 'voucher')
      .where('article.id = :id', { id: id })
      .getOne();
  }

  async findOne(id: number): Promise<Article> {
    return await this.articleRepo.findOne(id);
  }

  async create(partner: string, article: ArticleCreate): Promise<Article> {
    const newArticle = this.articleRepo.create({ ...article });
    newArticle.partner = partner;
    return await this.articleRepo.save(newArticle);
  }

  async update(article: Article): Promise<UpdateResult> {
    return await this.articleRepo.update(article.id, article);
  }

  async updateContent(
    id: number,
    update: ArticleUpdate,
  ): Promise<UpdateResult> {
    const article = await this.findOne(id);
    article.content = update.content;
    article.thumnail = update.thumnail;
    return await this.articleRepo.update(id, article);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.articleRepo.delete(id);
  }
}
