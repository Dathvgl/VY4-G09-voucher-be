import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCardService } from './giftcard.service';
import { GiftCardController } from './giftcard.controller';
import { GiftCard } from './giftcard.entity';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [TypeOrmModule.forFeature([GiftCard]), ContactModule],
  controllers: [GiftCardController],
  providers: [GiftCardService],
})
export class GiftCardModule {}
