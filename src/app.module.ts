import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { ContactModule } from './contact/contact.module';
import { GiftCardModule } from './giftcard/giftcard.module';
import { StripeModule } from './stripe/stripe.module';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule.forRoot(process.env.STRIPE_KEY, { apiVersion: '2020-08-27' }),
    TypeOrmModule.forRoot(config),
    VoucherModule,
    ArticleModule,
    GiftCardModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
