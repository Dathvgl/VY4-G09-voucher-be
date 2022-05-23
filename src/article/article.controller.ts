import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleCreate, ArticleUpdate } from './article.dto';
import { Article } from './article.entity';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get('find-all-id')
  findAllArticleId() {
    return this.articleService.findAllArticleId();
  }

  @Get('find/article-voucher?')
  findArticleVoucher(@Query('id') id: number): Promise<Article> {
    return this.articleService.findArticleVoucher(id);
  }

  @Post('create/partner?')
  @Header('Content-Type', 'application/json')
  create(@Query('id') partner: string, @Body() article: ArticleCreate) {
    return this.articleService.create(partner, article);
  }

  @Put()
  update(@Body() article: Article) {
    return this.articleService.update(article);
  }

  @Put('content/article?')
  updateArticle(@Query('id') id: number, @Body() update: ArticleUpdate) {
    return this.articleService.updateContent(id, update);
  }

  @Delete('delete/article?')
  deleteVoucher(@Query('id') id: number) {
    return this.articleService.delete(id);
  }
}
