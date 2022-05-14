import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { GiftCardModule } from './giftcard/giftcard.module';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    VoucherModule,
    ArticleModule,
    GiftCardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
